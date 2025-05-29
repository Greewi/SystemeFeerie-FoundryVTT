import { ActionDialog } from "./actionDialog.js";
import { ElementSourceDialog } from "./elementSourceDialog.js";

export class SFDialogs {
	static openActionDialog() {
		ActionDialog.open();
	}

	static extactElement(actor) {
		ElementSourceDialog.open(actor, null);
	}

	static extractElementForItem(actor, item) {
		ElementSourceDialog.open(actor, item);
	}
}