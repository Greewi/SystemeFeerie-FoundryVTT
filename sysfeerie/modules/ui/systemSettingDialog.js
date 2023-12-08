import { SFUtility } from "../utility.js";
import { Category } from "../models/category.js";
import { SFDialogs } from "./dialogs.js";

export class SystemSettingDialog extends FormApplication {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sysfeerie"],
			template: SFUtility.getSystemRessource("templates/dialog/systemSetting-dialog.html"),
			id:'settings_system',
			title:game.i18n.localize("SYSFEERIE.Settings.System"),
			resizable:true,
			width: 650,
			height: 500,
			scrollY : [".systemSetting_content"]
		});
	}

	/**
	 * @override
	 */
	getData() {
		const data = super.getData();
		data.categories = Category.getCategories();
		return data;
	}

	/**
	 * @override
	 */
	activateListeners(html) {
		super.activateListeners(html);

		html.find(".categorySetting_disableCategory").click(ev => {
			let id = ev.currentTarget.dataset.id;
			Category.updateCategory(id, {"enabled" : false}).then(() => this.render(true));
		});
		html.find(".categorySetting_enableCategory").click(ev => {
			let id = ev.currentTarget.dataset.id;
			Category.updateCategory(id, {"enabled" : true}).then(() => this.render(true));
		});
		html.find(".categorySetting_deleteCategory").click(ev => {
			let id = ev.currentTarget.dataset.id;
			Category.removeCategory(id).then(() => this.render(true));
		});
		html.find(".categorySetting_addButton").click(ev => {
			SFDialogs.createCategory(()=>{
				this.render(true);
			});
		});
	}

	async _updateObject(event, formData) {
		let categories = Category.getCategories();
		for(let id in categories) {
			await Category.updateCategory(id, {
				"name" : formData[`data.${id}.name`],
				"short" : formData[`data.${id}.short`],
				"description" : formData[`data.${id}.description`],
				"levels" : [
					formData[`data.${id}.levels.0`],
					formData[`data.${id}.levels.1`],
					formData[`data.${id}.levels.2`],
					formData[`data.${id}.levels.3`]
				]
			});
		}
	}
}
