import { SystemSetting } from "../models/systemSetting.js";
import { SFDialogs } from "../ui/dialogs.js";
import { SFUtility } from "../utility.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SFItemSheet extends ItemSheet {

	constructor(item={}, options={}) {
		super(item, options);
		if(item.type == "plot")
			this.position.height = 700;
		if(item.type == "status")
			this.position.height = 170;
	}

	/**
	 * @override
	 */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sysfeerie", "sheet", "item"],
			template: SFUtility.getSystemRessource("templates/elemnt-sheet.html"),
			width: 520,
			height: 300,
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
		});
	}

	/**
	 * @override
	 */
	getData() {
		const data = super.getData();
		if(this.item.type == "element") {
			// Select des catégories
			data.categories = {};
			let categories = SystemSetting.getCategories();
			for(let category of categories) {
					data.categories[category.id] = category.name;
			}
			// Select des niveaux
			data.levels = {};
			let category = SystemSetting.getCategory(this.item.system.category);
			if(!category)
				category = SystemSetting.getCategories()[0];
			if(category) {
				for(let i=0; i<category.levels.length; i++)
					data.levels[i] = `${i} - ${category.levels[i]}`;
			} else {
				data.levels = {"0":"0", "1":"1", "2":"2", "3":"3"};
			}
		} else if(this.item.type == "status") {
			data.levels = {
				"0":`0 - ${game.i18n.localize("SYSFEERIE.Status.Level0")}`,
				"1":`1 - ${game.i18n.localize("SYSFEERIE.Status.Level1")}`,
				"2":`2 - ${game.i18n.localize("SYSFEERIE.Status.Level2")}`,
				"3":`3 - ${game.i18n.localize("SYSFEERIE.Status.Level3")}`
			};
		} else if(this.item.type == "plot") {
			data.incomplet = this.item.system.stepNumber > this.item.system.steps.length;
			// Select des catégories
			data.categories = {};
			let categories = SystemSetting.getCategories();
			for(let category of categories)
				data.categories[category.id] = category.name;
			// Select des niveaux
			data.levels = {};
			let category = SystemSetting.getCategory(this.item.system.rewardCategory);
			if(!category)
				category = SystemSetting.getCategories()[0];
			if(category) {
				for(let i=0; i<category.levels.length; i++)
					data.levels[i] = `${i} - ${category.levels[i]}`;
			} else {
				data.levels = {"0":"0", "1":"1", "2":"2", "3":"3"};
			}
		}
		return data;
	}

	/**
	 * @override
	 */
	get template() {
		if(this.item.type == "plot")
			return SFUtility.getSystemRessource("templates/plot-sheet.html");
		if(this.item.type == "status")
			return SFUtility.getSystemRessource("templates/status-sheet.html");
		return SFUtility.getSystemRessource("templates/element-sheet.html");
	}

	/**
	 * @override
	 */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;

		// Update Inventory Item
		if(this.item.type == "plot") {
			html.find('.plotStep_Finish').click(ev => {
				ev.stopPropagation();
				let newSteps = this.item.system.steps.concat(this.item.system.currentStep);
				this.item.update({"system.steps":newSteps, "system.currentStep":""});
			});
			html.find('.plotStep_delete').click(ev => {
				let stepId = $(ev.currentTarget).data("stepId");
				ev.stopPropagation();
				this.item.system.steps.splice(stepId, 1);
				this.item.update({"system.steps":this.item.system.steps});
			});
		}

		// Extract element source
		if(this.item.type == "element") {
			if(this.item.actor) {
				html.find('.elementSheet_extractButton').click(ev => {
					SFDialogs.extractElementForItem(this.item.actor, this.item);
				});	
			}
		}
	}

	/**
	 * @override
	 */
	_createEditor(target, editorOptions, initialContent) {
		editorOptions.content_css = SFUtility.getSystemRessource("styles/mce.css");
		return super._createEditor(target, editorOptions, initialContent);
	}
}
