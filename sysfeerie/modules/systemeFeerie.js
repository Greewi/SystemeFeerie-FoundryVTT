import { SystemeFeerieAction } from "./action.js";
import { PlayerCharacterActor } from "./models/actor.js";
import { SFItem } from "./models/item.js";
import { SFActorSheet } from "./sheets/actor-sheet.js";
import { SFItemSheet } from "./sheets/item-sheet.js";
import { SFDialogs } from "./ui/dialogs.js";
import { SFUtility } from "./utility.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization and Hooks        */
/* -------------------------------------------- */

Hooks.once("setup", async function () {
});

Hooks.once("init", async function () {
	console.log(`Initializing Systeme Feerie System`);

	// Define custom Entity classes
	CONFIG.Actor.documentClass = PlayerCharacterActor;
	CONFIG.Item.documentClass = SFItem;
	CONFIG.ui.items.entryPartial = SFUtility.getSystemRessource("templates/sidebar/document-partial.html");

	// Register sheet application classes
	foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
	foundry.documents.collections.Actors.registerSheet("sysfeerie", SFActorSheet, { makeDefault: true });
	foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
	foundry.documents.collections.Items.registerSheet("sysfeerie", SFItemSheet, { makeDefault: true });
});

Hooks.once("diceSoNiceReady", (dice3d) => {
	dice3d.addSystem({id: "3e_terre_dice_set", name: "The Rollsmith - Bloodstone"}, "preferred");
	dice3d.addDicePreset({
		type: "d6",
		modelFile: SFUtility.getSystemRessource("dices/3e_terre/d6.glb"),
		system: "3e_terre_dice_set"
	});
	game.settings.set("dice-so-nice","enabledSimultaneousRollForMessage",false);
});

Hooks.once("ready", async function () {

	game.systemeFeerie = new SystemeFeerie();

	Handlebars.registerHelper('select', function(value, options) {
		let html = options.fn(this);
		html = html.replace(new RegExp(' value=\"' + value + '\"'), '$& selected="selected"');
		return html;
	});

	Handlebars.registerHelper('category', function (categoryId) {
		let categories = game.items.filter(item => item.type === "category");
		let category = categories.find(cat => cat.id === categoryId);
		if(!category)
			return "Unknown category";
		return category.name;
	})

	CONFIG.TinyMCE.content_css[0] = SFUtility.getSystemRessource("styles/mce.css");

	game.socket.on("system.sysfeerie", data => {
		switch (data.type) {
			case "setItem":
				if (game.user.isGM && game.systemeFeerie.pendingAction) {
					let item = game.actors.get(data.payload.idActor).items.get(data.payload.idItem);
					game.systemeFeerie.pendingAction.setItem(item);
				}
				break;
			case "removeItem":
				if (game.user.isGM && game.systemeFeerie.pendingAction) {
					game.systemeFeerie.pendingAction.removeItem(data.payload.slot);
				}
				break;
			case "updateGMAck":
				if (!game.user.isGM) {
					SystemeFeerieAction.updateGMAck(data.payload.ack);
				}
				break;
			case "updateRelevance":
				if (!game.user.isGM) {
					SystemeFeerieAction.setRelevance(data.payload.relevance);
				}
				break;
			case "cleanAction":
				if (game.user.isGM && game.systemeFeerie.pendingAction) {
					game.systemeFeerie.pendingAction.cleanAction();
				}
		}
	});
});

/**
 * Action resolution system
 */
Hooks.on("renderChatMessageHTML", async (app, html, msg) => {
	if (!game.user.isGM) {
		for(let elt of html.querySelectorAll(".approveSkills"))
			elt.remove();
		for(let elt of html.querySelectorAll(".selectRelevance"))
			elt.disabled = true;
	}

	for(let elt of html.querySelectorAll('.skill-remove')) {
		elt.addEventListener("click", async ev => {
			ev.stopPropagation();
			let itemSlot = parseInt($(ev.currentTarget).parents(".action-skill").data("slot"));
			if (game.user.isGM && game.systemeFeerie.pendingAction)
				game.systemeFeerie.pendingAction.removeItem(itemSlot);
			else {
				game.socket.emit("system.sysfeerie", {
					type: "removeItem",
					payload: {
						slot: itemSlot
					}
				});
			}
		});
	}

	for(let elt of html.querySelectorAll('.approveSkills')) {
		elt.addEventListener("click", async ev => {
			SystemeFeerieAction.updateGMAck(true);
		});
	}

	for(let elt of html.querySelectorAll('.startAction')) {
		elt.addEventListener("click", async ev => {
			let action = $(ev.currentTarget).data("action");
			let difficulty = parseInt($(ev.currentTarget).data("difficulty"), 10);
			let score = parseInt($(ev.currentTarget).data("score"), 10);
			let isOpposition = $(ev.currentTarget).data("isOpposition") == true;
			let opponentDifficulty = parseInt($(ev.currentTarget).data("opponentDifficulty"), 10);
			let opponentScore = parseInt($(ev.currentTarget).data("opponentScore"), 10);
			SystemeFeerieAction.resolveAction(action, difficulty, score, isOpposition, opponentDifficulty, opponentScore);
		});
	}

	for(let elt of html.querySelectorAll('.selectRelevance')) {
		elt.addEventListener("change", async ev => {
			let relevance = $(ev.currentTarget)[0].value ;
			SystemeFeerieAction.setRelevance(relevance);
		});
	}

	for(let elt of html.querySelectorAll('.action-skill')) {
		elt.addEventListener("click", async ev => {
			game.actors.get(game.user.character?.id)?.sheet.render(true);
		});
	}
});

// Fix : macros created with drag&drop to hotbar had the default icon instead of the icon of the dropped document
Hooks.on("createMacro", (macro, option, macroId) => {
	const macroRegexp = /^await Hotbar.toggleDocumentSheet\("([A-Za-z0-9]+)\.([A-Za-z0-9]+)"\);$/;
	let match = macro.command.match(macroRegexp);
	if(!match)
		return;
	let docType = match[1];
	let docId = match[2];
	let doc = null;
	switch(docType) {
		case "Actor" : doc = game.actors.get(docId); break;
		case "Item" : doc = game.items.get(docId); break;
		case "JournalEntry" : doc = game.journal.get(docId); break;
	}
	if(doc && doc.img)
		macro.update({img:doc.img});
});

/* -------------------------------------------- */
/*  Systeme Feerie main class                   */
/* -------------------------------------------- */
class SystemeFeerie {
	constructor() {
		this.pendingAction = null;

		if (game.user.isGM && localStorage.getItem("pendingAction"))
			this.pendingAction = SystemeFeerieAction.fromJSON(localStorage.getItem("pendingAction"));
	}

	/**
	 * Open a dialog to begin an action. Let the GM specify a difficulty
	 */
	openActionDialog() {
		SFDialogs.openActionDialog();
	}

	/**
	 * Start a new action. Sends a special interactive message in the chat to request the skills to use
	 */
	beginAction(action, difficulty, significance, isOpposition=false, opponentDifficulty=0, opponentRating=0) {
		if (!game.user.isGM)
			return;
		this.pendingAction = new SystemeFeerieAction(action, difficulty, significance, isOpposition, opponentDifficulty, opponentRating);
		this.pendingAction.createChatCard();
	}

	async beginLuckRoll() {
		let roll = await new Roll(`1d6`).roll();
		let rollResult = parseInt(roll.result,10);
		let success = rollResult > 3;
		let data = {
			die : {
				"class" : success ? "resolve-action-roll-success":"resolve-action-roll-failed",
				"value" : rollResult
			},
			ClassActionResult : success ? "resolve-action-success" : "resolve-action-failed",
			TextActionResult : success ? `<i class="fas fa-check"></i> ${game.i18n.localize("SYSFEERIE.Chat.LuckRollSuccess")}` : `<i class="fas fa-times"></i> ${game.i18n.localize("SYSFEERIE.Chat.LuckRollFailure")}`
		};

		renderTemplate(SFUtility.getSystemRessource("templates/chat/resolve-luckroll.html"), data).then(html => {
			let chatOptions = SFUtility.chatDataSetup(html, null, true);
			chatOptions.roll = roll;
			ChatMessage.create(chatOptions);
		});
	}
}
