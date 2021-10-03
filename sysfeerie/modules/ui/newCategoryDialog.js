import { Category } from "../models/category.js";
import { SFUtility } from "../utility.js";

export class NewCategoryDialog extends Dialog {
	static open(onClose) {
		if (!game.user.isGM)
			return;
		renderTemplate(SFUtility.getSystemRessource("templates/dialog/newCategory-dialog.html")).then(html => {
			let dialog = new NewCategoryDialog({
				title: game.i18n.localize("SYSFEERIE.Dialog.NewCategory"),
				content: html,
				buttons: {
					cancel: {
						icon: '<i class="fas fa-times"></i>',
						label: game.i18n.localize("SYSFEERIE.Dialog.Cancel")
					},
					ok: {
						icon: '<i class="fas fa-check"></i>',
						label: game.i18n.localize("SYSFEERIE.Dialog.OK"),
						callback: () => dialog.createCategory()
					}
				},
				default: "ok",
				close : onClose
			}, { width: 400, classes: ["sysfeerie"] });
			dialog.render(true);
		});
	}

	constructor(dialogData, options) {
		super(dialogData, options);
	}

	
	/** @override */
	activateListeners(html) {
		super.activateListeners(html);
		this._input = html.find(".newCategory_input");
	}

	createCategory() {
		let categories = Category.getCategories();
		let id = this._input.val();
		if(categories[id]) {
			ui.notifications.error(game.i18n.localize("SYSFEERIE.Dialog.CategoryAlreadyExisting"));
		} else {
			Category.addCategory(id.toUpperCase());
		}
	}
}

import { CategorySettingDialog } from "./categorySettingDialog.js";
