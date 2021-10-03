import { Category } from "../models/category.js";
import { SFDialogs } from "../ui/dialogs.js";
import { SFUtility } from "../utility.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SFItemSheet extends ItemSheet {

	constructor(item={}, options={}) {
		super(item, options);
		if(item.data.type == "plot")
			this.position.height = 700;
		if(item.data.type == "status")
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
		if(this.item.data.type == "element") {
			// Select des catégories
			data.categories = {};
			let categories = Category.getCategories();
			for(let categorieId in categories) {
				if(categories[categorieId].enabled)
					data.categories[categorieId] = categories[categorieId].name;
			}
			// Select des niveaux
			data.levels = {};
			let category = Category.getCategory(this.item.data.data.category);
			if(category) {
				for(let i=0; i<category.levels.length; i++)
					data.levels[i] = `${i} - ${category.levels[i]}`;
			} else {
				data.levels = {"0":"0", "1":"1", "2":"2", "3":"3"};
			}
		} else if(this.item.data.type == "status") {
			data.levels = {
				"0":`0 - ${game.i18n.localize("SYSFEERIE.Status.Level0")}`,
				"1":`1 - ${game.i18n.localize("SYSFEERIE.Status.Level1")}`,
				"2":`2 - ${game.i18n.localize("SYSFEERIE.Status.Level2")}`,
				"3":`3 - ${game.i18n.localize("SYSFEERIE.Status.Level3")}`
			};
		} else if(this.item.data.type == "plot") {
			data.incomplet = this.item.data.data.stepNumber > this.item.data.data.steps.length;
			// Select des catégories
			data.categories = {};
			let categories = Category.getCategories();
			for(let categorieId in categories)
				if(categories[categorieId].enabled)
					data.categories[categorieId] = categories[categorieId].name;
			// Select des niveaux
			data.levels = {};
			let category = Category.getCategory(this.item.data.data.rewardCategory);
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
		if(this.item.data.type == "plot")
			return SFUtility.getSystemRessource("templates/plot-sheet.html");
		if(this.item.data.type == "status")
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
		if(this.item.data.type == "plot") {
			html.find('.plotStep_Finish').click(ev => {
				ev.stopPropagation();
				let newSteps = this.item.data.data.steps.concat(this.item.data.data.currentStep);
				this.item.update({"data.steps":newSteps, "data.currentStep":""});
			});
			html.find('.plotStep_delete').click(ev => {
				let stepId = $(ev.currentTarget).data("stepId");
				ev.stopPropagation();
				this.item.data.data.steps.splice(stepId, 1);
				this.item.update({"data.steps":this.item.data.data.steps});
			});
		}

		// Extract element source
		if(this.item.data.type == "element") {
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
