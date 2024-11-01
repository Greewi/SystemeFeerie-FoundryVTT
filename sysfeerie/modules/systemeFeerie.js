import { SystemeFeerieAction } from "./action.js";
import { PlayerCharacterActor } from "./models/actor.js";
import { SFItem } from "./models/item.js";
import { SystemSetting } from "./models/systemSetting.js";
import { SFActorSheet } from "./sheets/actor-sheet.js";
import { SFItemSheet } from "./sheets/item-sheet.js";
import { CategorySettingDialog } from "./ui/categorySettingDialog.js";
import { SFDialogs } from "./ui/dialogs.js";
import { SettingLoadPresetDialog } from "./ui/settingLoadPresetDialog.js";
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
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("sysfeerie", SFActorSheet, { makeDefault: true });
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("sysfeerie", SFItemSheet, { makeDefault: true });

	// Register system settings
	game.settings.registerMenu("sysfeerie", "loadPresetMenu", {
		name: game.i18n.localize("SYSFEERIE.Settings.LoadPreset"),
		label: game.i18n.localize("SYSFEERIE.Settings.LoadPresetButton"),
		hint: game.i18n.localize("SYSFEERIE.Settings.LoadPresetHint"),
		icon: "fas fa-bars",
		type: SettingLoadPresetDialog,
		restricted: true
	});
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
	game.settings.register("sysfeerie", "systemSetting", {
		name: game.i18n.localize("SYSFEERIE.Settings.SystemSetting"),
		hint: game.i18n.localize("SYSFEERIE.Settings.SystemSettingHint"),
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
		let category = SystemSetting.getCategory(categoryId);
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
Hooks.on("renderChatMessage", async (app, html, msg) => {
	if (!game.user.isGM) {
		html.find(".approveSkills").remove();
		html.find(".selectRelevance").prop("disabled",true);
	}
});

Hooks.on('renderChatLog', (log, html, data) => {
	html.on("click", '.skill-remove', async ev => {
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

	html.on("click", '.approveSkills', async ev => {
		SystemeFeerieAction.updateGMAck(true);
	});

	html.on("click", ".startAction", async ev => {
		let difficulty = parseInt($(ev.currentTarget).data("difficulty"), 10);
		let score = parseInt($(ev.currentTarget).data("score"), 10);
		let isOpposition = $(ev.currentTarget).data("isOpposition") == true;
		let opponentDifficulty = parseInt($(ev.currentTarget).data("opponentDifficulty"), 10);
		let opponentScore = parseInt($(ev.currentTarget).data("opponentScore"), 10);
		SystemeFeerieAction.resolveAction(difficulty, score, isOpposition, opponentDifficulty, opponentScore);
	});

	html.on("change", ".selectRelevance", async ev => {
		let relevance = $(ev.currentTarget)[0].value ;
		SystemeFeerieAction.setRelevance(relevance);
	});

	html.on("click", ".action-skill", async ev => {
		game.actors.get(game.user.character?.id)?.sheet.render(true);
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
	 * Open a dialog to begin an opposing action. Let the GM specify the opposition stats
	 */
	openOpposingActionDialog() {
		SFDialogs.openOpposingActionDialog();
	}

	/**
	 * Start a new action. Sends a special interactive message in the chat to request the skills to use
	 */
	beginAction(difficulty, significance, isOpposition=false, opponentDifficulty=0, opponentRating=0) {
		if (!game.user.isGM)
			return;

		this.pendingAction = new SystemeFeerieAction(difficulty, significance, isOpposition, opponentDifficulty, opponentRating);
		this.pendingAction.createChatCard();
	}
}
