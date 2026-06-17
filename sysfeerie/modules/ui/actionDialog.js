import Consts from "../consts.js";
import { SFUtility } from "../utility.js";

export class ActionDialog extends Dialog {

	static open() {
		if (!game.user.isGM)
			return;
		let actionsData = [];
		let actions = game.items.filter(item => item.type === "action");
		for(let action of actions) {
			let difficulties = [];
			for(let i=0; i<action.system.difficulties.length; i++) {
				difficulties.push({
					level : action.system.difficulties[i].level,
					description : action.system.difficulties[i].description,
					name : action.system.difficulties[i].name,
					icon : Consts.DIFFICULTIES_ICONS[Math.round(i*Consts.DIFFICULTIES_ICONS.length/action.system.difficulties.length)]
				});
			}
			let difficultyMods = [];
			let minMod = 99999;
			let maxMod = -99999;
			for(let i=0; i<action.system.difficultyMods.length; i++) {
				if(action.system.difficultyMods[i].level < minMod)
					minMod = action.system.difficultyMods[i].level;
				if(action.system.difficultyMods[i].level > maxMod)
					maxMod = action.system.difficultyMods[i].level;
			}
			for(let i=0; i<action.system.difficultyMods.length; i++) {
				let iconIndex = 0;
				if(maxMod!=minMod) {
					iconIndex = (action.system.difficultyMods[i].level - minMod)/(maxMod-minMod);
					iconIndex = Math.round(iconIndex*(Consts.DIFFICULTY_MODS_ICONS.length-1));
				}
				difficultyMods.push({
					level : action.system.difficultyMods[i].level,
					description : action.system.difficultyMods[i].description,
					name : action.system.difficultyMods[i].name,
					icon : Consts.DIFFICULTY_MODS_ICONS[iconIndex]
				});
			}
			actionsData.push({
				id : action.id, 
				name : action.name,
				default : action.system.default,
				version : action.system.version,
				maxElementNumber : action.system.maxElementNumber,
				scoreMethod : action.system.scoreMethod,
				qualityMethod : action.system.qualityMethod,
				difficulties : difficulties,
				difficultyMods : difficultyMods,
				selected : false
			});
		}

		// Ordering and default action
		actionsData.sort((a, b) => a.name.localeCompare(b.name))
		let actionsTypes = {};
		let defaultAction = actionsData[0];
		for(let action of actionsData) {
			actionsTypes[action.id] = action.name;
			if(action.default)
				defaultAction = action;
		}
		defaultAction.selected=true;
		
		renderTemplate(SFUtility.getSystemRessource("templates/dialog/action-dialog.html"), {
			ActionsTypes : actionsTypes,
			Actions : actionsData,
			DefaultAction : defaultAction.id,
			DefaultDifficulty : defaultAction.difficulties[Math.floor(defaultAction.difficulties.length/2)].level,
			DefaultDifficultyMod : 0, 
		}).then(html => {
			let dialog = new ActionDialog({
				title: game.i18n.localize("SYSFEERIE.Dialog.StartAction"),
				content: html,
				buttons: {
					ok: {
						icon: '<i class="fas fa-play"></i>',
						label: game.i18n.localize("SYSFEERIE.Dialog.StartActionNow"),
						callback: () => {
							let difficulty = dialog._element.find(".actionDialog_value_difficulty").val();
							let difficultyMod = dialog._element.find(".actionDialog_value_difficultyMod").val();
							let action = dialog._element.find("#actionDialog_action_select").val();
							game.systemeFeerie.beginAction(action, parseInt(difficulty, 10), parseInt(difficultyMod, 10));
						}
					}
				},
				default: "ok"
			}, { width: 650, classes: ["sysfeerie"] });
			dialog.render(true);
		});
	}

	constructor(dialogData, options) {
		super(dialogData, options);
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Change action type
		html.find("#actionDialog_action_select").change(ev => {
			let element = ev.currentTarget;
			let actionId = element.value;
			html.find(".actionDialog_action").removeClass("actionDialog_action_selected");
			html.find("#action_"+actionId).addClass("actionDialog_action_selected");
		});

		// Update reference to the ui
		this.difficultyButtons = [];
		this.difficultyModButtons = [];
		html.find(".actionDialog_button").each((i, button) => {
			if(button.parentElement.classList.contains("actionDialog_difficultyMod")) {
				this.difficultyModButtons.push(button);
			} else {
				this.difficultyButtons.push(button);
			}
		});
		this.difficultyValue = html.find('.actionDialog_value_difficulty');
		this.difficultyModValue = html.find('.actionDialog_value_difficultyMod');

		// Click on a button
		html.find(".actionDialog_button").click(ev => {
			let element = ev.currentTarget;
			let parent = element.parentElement;
			let id = element.dataset.button;
			let type = parent.classList.contains("actionDialog_difficultyMod") ? "difficultyMod" : "difficulty";
			if (type == "difficulty") {
				html.find('.actionDialog_value_difficulty').val(parseInt(id));
			} else {
				html.find('.actionDialog_value_difficultyMod').val(parseInt(id));
			}
			this._updateButtons(html);
		});

		// Update of the difficulty inputs
		html.find(".actionDialog_value_difficulty").change(ev => this._updateButtons());
		html.find(".actionDialog_value_difficultyMod").change(ev => this._updateButtons());

		this._updateButtons();
	}

	/**
	 * Update the button states
	 */
	_updateButtons() {
		for(let button of this.difficultyButtons) {
			if(button.dataset.button == this.difficultyValue.val())
				button.classList.add("actionDialog_button_selected");
			else
				button.classList.remove("actionDialog_button_selected");
		}
		for(let button of this.difficultyModButtons) {
			if(button.dataset.button == this.difficultyModValue.val())
				button.classList.add("actionDialog_button_selected");
			else
				button.classList.remove("actionDialog_button_selected");
		}
	}
}