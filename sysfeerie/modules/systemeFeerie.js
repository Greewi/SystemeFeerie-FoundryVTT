import { SystemeFeerieAction } from "./action.js";
import { PlayerCharacterActor } from "./models/actor.js";
import { Category } from "./models/category.js";
import { SFItem } from "./models/item.js";
import { SFActorSheet } from "./sheets/actor-sheet.js";
import { SFItemSheet } from "./sheets/item-sheet.js";
import { CategorySettingDialog } from "./ui/categorySettingDialog.js";
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

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("sysfeerie", SFActorSheet, { makeDefault: true });
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("sysfeerie", SFItemSheet, { makeDefault: true });

	// Register system settings
	game.settings.registerMenu("sysfeerie", "categoryMenu", {
		name: game.i18n.localize("SYSFEERIE.Settings.Categories"),
		label: game.i18n.localize("SYSFEERIE.Settings.CategoriesButton"),
		hint: game.i18n.localize("SYSFEERIE.Settings.CategoriesHint"),
		icon: "fas fa-bars",
		type: CategorySettingDialog,
		restricted: true
	});
	game.settings.register("sysfeerie", "categories", {
		name: game.i18n.localize("SYSFEERIE.Settings.Categories"),
		hint: game.i18n.localize("SYSFEERIE.Settings.CategoriesHint"),
		scope: "world",
		config: false,
		type: String,
		default: '',
	});
});

Hooks.once("diceSoNiceReady", (dice3d) => {
	dice3d.addSystem({id: "3e_terre_dice_set", name: "The Rollsmith - Bloodstone"}, "preferred");
	dice3d.addDicePreset({
		type: "d6",
		modelFile: SFUtility.getSystemRessource("dices/3e_terre/d6.glb"),
		system: "3e_terre_dice_set"
	});
});

Hooks.once("ready", async function () {

	game.systemeFeerie = new SystemeFeerie();

	Handlebars.registerHelper('select', function(value, options) {
		let html = options.fn(this);
		html = html.replace(new RegExp(' value=\"' + value + '\"'), '$& selected="selected"');
		return html;
	});

	Handlebars.registerHelper('category', function (categoryId) {
		let category = Category.getCategory(categoryId);
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
Hooks.on("renderChatMessage", async (app, html, msg) => {
	if (!game.user.isGM)
		html.find(".approveSkills").remove();
});

Hooks.on('renderChatLog', (log, html, data) => {
	html.on("click", '.skill-remove', async ev => {
		ev.stopPropagation();
		let itemSlot = $(ev.currentTarget).parents(".action-skill").hasClass("action-skill-1") ? 1 : 2;
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

	html.on("click", '.approveSkills', async ev => {
		SystemeFeerieAction.updateGMAck(true);
	});

	html.on("click", ".startAction", async ev => {
		let actionScore = parseInt($(ev.currentTarget).data("actionscore"), 10);
		SystemeFeerieAction.resolveAction(actionScore);
	});

	html.on("click", ".action-skill", async ev => {
		game.actors.get(game.user.character?.id)?.sheet.render(true);
	});
});

/**
 * Drag and drop of characters, items and journals entry on the hot bar
 */
Hooks.on('hotbarDrop', async (bar, data, slot) => {

	const elementsTypes = {
		'Actor' : {
			'collection' : 'actors',
			'defaultImg' : "icons/svg/cowled.svg"
		},
		'Item' : {
			'collection' : 'items',
			'defaultImg' : "icons/svg/coins.svg"
		},
		'JournalEntry' : {
			'collection' : 'journal',
			'defaultImg' : "icons/svg/book.svg"
		}
	};

	// With the workaround, some elements dont have their type set
	if(!elementsTypes[data.type]) {
		for(let type in elementsTypes)
			if(game[elementsTypes[type].collection].get(data.id))
				data.type = type;
		if(!elementsTypes[data.type])
			return;
	}

	const collection = elementsTypes[data.type].collection;
	const defaultImg = elementsTypes[data.type].defaultImg;

	const command = `
		(function () {
			const element = game.${collection}.get('${data.id}');
			if (element?.sheet.rendered) {
				element.sheet.close();
			} else {
				element.sheet.render(true);
			}
		})();
	`.trim();
	const element = game[collection].get(data.id);
	const name = element.name;
	const img = element.img ? element.img : defaultImg;

	let macro = game.macros.find(macro => {
		let found = macro.data.name === name && macro.data.command === command
		return found;
	});

	if (!macro) {
		macro = await Macro.create({
			name: name,
			type: 'script',
			img: img,
			command: command
		}, {renderSheet: false});
	}

	game.user.assignHotbarMacro(macro, slot);
	return false;
});

/**
 * Work around to enable drag&drop of the journal entries for the non GM/Assistant player
 */
Hooks.on('renderJournalDirectory', async (journalDirectory, html, data) => {
	const role = game.users.get(game.userId).role
	if(role == CONST.USER_ROLES.ASSISTANT || role == CONST.USER_ROLES.GAMEMASTER)
		return;

	const journalElements = html.find('li.journal.flexrow');
	journalElements.each((index, element) => {
		const journalId = element.dataset.documentId;
		if(!journalId)
			return;
		element.draggable = true;
		element.ondragstart = journalDirectory._onDragStart;
	});
});

/**
 * Work around to enable drag&drop of the actors for user that dont have the right to create tokens
 */
Hooks.on('renderActorDirectory', async (actorDirectory, html, data) => {
	if(TokenDocument.canUserCreate(game.user))
		return;

	const actorElements = html.find('li.actor.flexrow');
	actorElements.each((index, element) => {
		const actorId = element.dataset.documentId;
		if(!actorId)
			return;
		element.draggable = true;
		element.ondragstart = actorDirectory._onDragStart;
	});
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
	beginAction(difficulty, significance) {
		if (!game.user.isGM)
			return;

		this.pendingAction = new SystemeFeerieAction(difficulty, significance);
		this.pendingAction.createChatCard();
	}
}
