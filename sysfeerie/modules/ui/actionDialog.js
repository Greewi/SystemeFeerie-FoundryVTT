import { SYSFEERIE_CFG } from "../config.js";
import { SystemSetting } from "../models/systemSetting.js";
import { SFUtility } from "../utility.js";

export class ActionDialog extends Dialog {

	static open() {
		if (!game.user.isGM)
			return;
		renderTemplate(SFUtility.getSystemRessource("templates/dialog/action-dialog.html"), {
			Difficulties : SystemSetting.getDifficulties(),
			Significances : SystemSetting.getSignifiances(),
			DefaultDifficulty : SystemSetting.getDifficulties()[Math.floor(SystemSetting.getDifficulties().length/2)].score,
			DefaultSignifiance : SystemSetting.getSignifiances()[Math.floor(SystemSetting.getSignifiances().length/2)].score,
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
							let significance = dialog._element.find(".actionDialog_value_signifiance").val();
							game.systemeFeerie.beginAction(parseInt(difficulty, 10), parseInt(significance, 10));
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

		// Update reference to the ui
		this.difficultyButtons = {};
		this.signifianceButtons = {};
		html.find(".actionDialog_button").each((i, button) => {
			if(button.parentElement.classList.contains("actionDialog_significance")) {
				this.signifianceButtons[button.dataset.button] = button;
			} else {
				this.difficultyButtons[button.dataset.button] = button;
			}
		});
		this.difficultyValue = html.find('.actionDialog_value_difficulty');
		this.signifianceValue = html.find('.actionDialog_value_signifiance');

		// Click on a button
		html.find(".actionDialog_button").click(ev => {
			let element = ev.currentTarget;
			let parent = element.parentElement;
			let id = element.dataset.button;
			let type = parent.classList.contains("actionDialog_significance") ? "significance" : "difficulty";
			if (type == "difficulty") {
				html.find('.actionDialog_value_difficulty').val(parseInt(id));
			} else {
				html.find('.actionDialog_value_signifiance').val(parseInt(id));
			}
			this._updateButtons(html);
		});

		// Update of the difficulty inputs
		html.find(".actionDialog_value_difficulty").change(ev => this._updateButtons());
		html.find(".actionDialog_value_signifiance").change(ev => this._updateButtons());

		this._updateButtons();
	}

	/**
	 * Update the button states
	 */
	_updateButtons() {
		for(let i in this.difficultyButtons)
			this.difficultyButtons[i].classList.remove("actionDialog_button_selected");
		if(this.difficultyButtons[this.difficultyValue.val()])
			this.difficultyButtons[this.difficultyValue.val()].classList.add("actionDialog_button_selected")
		for(let i in this.signifianceButtons)
			this.signifianceButtons[i].classList.remove("actionDialog_button_selected");
		if(this.signifianceButtons[this.signifianceValue.val()])
			this.signifianceButtons[this.signifianceValue.val()].classList.add("actionDialog_button_selected")
	}
}