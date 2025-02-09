import { SYSFEERIE_CFG } from "../config.js";
import { SystemSetting } from "../models/systemSetting.js";
import { SFUtility } from "../utility.js";

export class OpposingActionDialog extends Dialog {

	static open() {
		if (!game.user.isGM)
			return;
		renderTemplate(SFUtility.getSystemRessource("templates/dialog/opposingAction-dialog.html"), {
			Difficulties : SystemSetting.getDifficulties(),
			Significances : SystemSetting.getSignificances(),
			Ratings: SystemSetting.getRatings(),
			DefaultDifficulty : SystemSetting.getDifficulties()[Math.floor(SystemSetting.getDifficulties().length/2)].score,
			DefaultSignificance : SystemSetting.getSignificances()[Math.floor(SystemSetting.getSignificances().length/2)].score,
			DefaultOpponentRating : SystemSetting.getRatings()[Math.floor(SystemSetting.getRatings().length/2)].score,
			DefaultOpponentDifficulty : SystemSetting.getDifficulties()[Math.floor(SystemSetting.getDifficulties().length/2)].score,
			NoDisplayV5 : !SystemSetting.doesUseFullOppositions() ? "style=\"display:none\"" : ""
		}).then(html => {
			let dialog = new OpposingActionDialog({
				title: game.i18n.localize("SYSFEERIE.Dialog.StartAction"),
				content: html,
				buttons: {
					ok: {
						icon: '<i class="fas fa-play"></i>',
						label: game.i18n.localize("SYSFEERIE.Dialog.StartActionNow"),
						callback: () => {
							let difficulty = dialog._element.find(".actionDialog_value_difficulty").val();
							let significance = dialog._element.find(".actionDialog_value_significance").val();
							let opponentDifficulty = dialog._element.find(".actionDialog_value_opponentDifficulty").val();
							let opponentRating = dialog._element.find(".actionDialog_value_opponentRating").val();
							game.systemeFeerie.beginAction(parseInt(difficulty, 10), parseInt(significance, 10), true, parseInt(opponentDifficulty, 10), parseInt(opponentRating, 10));
						}
					}
				},
				default: "ok"
			}, { width: 750, classes: ["sysfeerie"] });
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
		this.significanceButtons = {};
		this.opponnentDifficultyButtons = {};
		this.opponentRatingButtons = {};
		html.find(".actionDialog_button").each((i, button) => {
			if(button.parentElement.classList.contains("actionDialog_difficulty")) {
				this.difficultyButtons[button.dataset.button] = button;
			} else if(button.parentElement.classList.contains("actionDialog_significance")) {
				this.significanceButtons[button.dataset.button] = button;
			} else if(button.parentElement.classList.contains("actionDialog_opponentDifficulty")) {
				this.opponnentDifficultyButtons[button.dataset.button] = button;
			} else if(button.parentElement.classList.contains("actionDialog_opponentRating")) {
				this.opponentRatingButtons[button.dataset.button] = button;
			}
		});
		this.difficultyValue = html.find('.actionDialog_value_difficulty');
		this.significanceValue = html.find('.actionDialog_value_significance');
		this.opponentDifficultyValue = html.find('.actionDialog_value_opponentDifficulty');
		this.opponentRatingValue = html.find('.actionDialog_value_opponentRating');

		// Click on a button
		html.find(".actionDialog_button").click(ev => {
			let element = ev.currentTarget;
			let parent = element.parentElement;
			let id = element.dataset.button;
			if(parent.classList.contains("actionDialog_difficulty")) {
				html.find('.actionDialog_value_difficulty').val(parseInt(id));
			} else if(parent.classList.contains("actionDialog_significance")) {
				html.find('.actionDialog_value_significance').val(parseInt(id));
			} else if(parent.classList.contains("actionDialog_opponentDifficulty")) {
				html.find('.actionDialog_value_opponentDifficulty').val(parseInt(id));
			} else if(parent.classList.contains("actionDialog_opponentRating")) {
				html.find('.actionDialog_value_opponentRating').val(parseInt(id));
			}
			this._updateButtons();
		});

		// Update of the difficulty inputs
		html.find(".actionDialog_value_difficulty").change(ev => this._updateButtons());
		html.find(".actionDialog_value_significance").change(ev => this._updateButtons());
		html.find(".actionDialog_value_opponentDifficulty").change(ev => this._updateButtons());
		html.find(".actionDialog_value_opponentRating").change(ev => this._updateButtons());

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
		for(let i in this.significanceButtons)
			this.significanceButtons[i].classList.remove("actionDialog_button_selected");
		if(this.significanceButtons[this.significanceValue.val()])
			this.significanceButtons[this.significanceValue.val()].classList.add("actionDialog_button_selected")
		for(let i in this.opponnentDifficultyButtons)
			this.opponnentDifficultyButtons[i].classList.remove("actionDialog_button_selected");
		if(this.opponnentDifficultyButtons[this.opponentDifficultyValue.val()])
			this.opponnentDifficultyButtons[this.opponentDifficultyValue.val()].classList.add("actionDialog_button_selected")
		for(let i in this.opponentRatingButtons)
			this.opponentRatingButtons[i].classList.remove("actionDialog_button_selected");
		if(this.opponentRatingButtons[this.opponentRatingValue.val()])
			this.opponentRatingButtons[this.opponentRatingValue.val()].classList.add("actionDialog_button_selected")
	}
}