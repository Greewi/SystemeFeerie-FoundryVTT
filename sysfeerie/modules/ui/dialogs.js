import { SFUtility } from "../utility.js";
import { ActionDialog } from "./actionDialog.js";
import { ElementSourceDialog } from "./elementSourceDialog.js";
import { NewCategoryDialog } from "./newCategoryDialog.js";

export class SFDialogs {
	static openCharPointInfos() {
		renderTemplate(SFUtility.getSystemRessource("templates/dialog/charPoints-dialog.html")).then(html => {
			let dialog = new Dialog({
				title: game.i18n.localize("SYSFEERIE.CharPointsHtml.Title"),
				content: html,
				buttons: {
					ok: {
						icon: '<i class="fas fa-check"></i>',
						label: game.i18n.localize("SYSFEERIE.Dialog.OK"),
					}
				},
				default : "ok"
			}, { width:650, classes: ["sysfeerie"] });
			dialog.render(true);
		});
	}

	static openActionDialog() {
		ActionDialog.open();
	}

	static extactElement(actor) {
		ElementSourceDialog.open(actor, null);
	}

	static extractElementForItem(actor, item) {
		ElementSourceDialog.open(actor, item);
	}

	static createCategory(onClose) {
		NewCategoryDialog.open(onClose);
	}
}