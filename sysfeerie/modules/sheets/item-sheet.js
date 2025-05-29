import Consts from "../consts.js";
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
		if(item.type == "information")
			this.position.height = 170;
		if(item.type == "ressource")
			this.position.height = 210;
		if(item.type == "category")
			this.position.height = 470;
		if(item.type == "action")
			this.position.height = 800;
	}

	/**
	 * @override
	 */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sysfeerie", "sheet", "item"],
			template: SFUtility.getSystemRessource("templates/element-sheet.html"),
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
			let categories = game.items.filter(item => item.type === "category");
			for(let category of categories) {
				data.categories[category.id] = category.name;
			}
			// Select des niveaux
			data.levels = {};
			let category = categories.find(cat => cat.id === this.item.system.category);
			if(!category)
				category = categories[0];
			if(category) {
				for(let i=0; i<category.system.levels.length; i++)
					data.levels[i] = `${i} - ${category.system.levels[i]}`;
			} else {
				data.levels = {"0":"0", "1":"1", "2":"2", "3":"3"};
			}
		} else if(this.item.type == "plot") {
			data.incomplet = this.item.system.stepNumber > this.item.system.steps.length;
			// Select des catégories
			data.categories = {};
			let categories = game.items.filter(item => item.type === "category");
			for(let category of categories)
				data.categories[category.id] = category.name;
			// Select des niveaux
			data.levels = {};
			let category = categories.find(cat => cat.id === this.item.system.rewardCategory);
			if(!category)
				category = categories[0];
			if(category) {
				for(let i=0; i<category.system.levels.length; i++)
					data.levels[i] = `${i} - ${category.system.levels[i]}`;
			} else {
				data.levels = {"0":"0", "1":"1", "2":"2", "3":"3"};
			}
		} else if(this.item.type == "action") {
			// Select for the version of the système féerie
			data.versions = {"5":"V5", "6":"V6"};
			// Select for the maximum number of elements in an action
			data.maxElements = {"2" : "2", "3" : "3", "4" : "4", "5" : "5", "6" : "6"};
			// Select for the character score calculation method
			data.scoreMethods = {
				[Consts.SCORE_SUM] : game.i18n.localize("SYSFEERIE.Consts.SCORE_SUM"),
				[Consts.SCORE_DEGRESSIVE_SUM] : game.i18n.localize("SYSFEERIE.Consts.SCORE_DEGRESSIVE_SUM"),
				[Consts.SCORE_MAX_PLUS_COUNT] : game.i18n.localize("SYSFEERIE.Consts.SCORE_MAX_PLUS_COUNT"),
				[Consts.SCORE_SECOND_HALVED_BY_RELEVANCE] : game.i18n.localize("SYSFEERIE.Consts.SCORE_SECOND_HALVED_BY_RELEVANCE"),
				[Consts.SCORE_RELEVANCE_PLUS_COUNT] : game.i18n.localize("SYSFEERIE.Consts.SCORE_RELEVANCE_PLUS_COUNT"),
			};
			// Select for the action quality calculation method
			data.qualityMethods = {
				[Consts.QUALITY_FROM_MARGIN] : game.i18n.localize("SYSFEERIE.Consts.QUALITY_FROM_MARGIN"),
				[Consts.QUALITY_FROM_DOUBLE] : game.i18n.localize("SYSFEERIE.Consts.QUALITY_FROM_DOUBLE"),
			};
		}
		return data;
	}

	/**
	 * @override
	 */
	get template() {
		if(this.item.type == "plot")
			return SFUtility.getSystemRessource("templates/plot-sheet.html");
		if(this.item.type == "information")
			return SFUtility.getSystemRessource("templates/information-sheet.html");
		if(this.item.type == "ressource")
			return SFUtility.getSystemRessource("templates/ressource-sheet.html");
		if(this.item.type == "category")
			return SFUtility.getSystemRessource("templates/category-sheet.html");
		if(this.item.type == "action")
			return SFUtility.getSystemRessource("templates/action-sheet.html");
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

		// Category levels management
		if(this.item.type == "category") {
			html.find('.category_addLevel').click(ev => {
				ev.stopPropagation();
				if(!Array.isArray(this.item.system.levels))
					this.item.system.levels = [];
				let newLevels = this.item.system.levels.concat([""]);
				this.item.update({"system.levels":newLevels});
			});
			html.find('.categoryLevel_delete').click(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				ev.stopPropagation();
				this.item.system.levels.splice(levelId, 1);
				this.item.update({"system.levels":this.item.system.levels});
			});
			html.find('.categoryLevel_value').change(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				this.item.system.levels[levelId] = $(ev.currentTarget).val();
				this.item.update({"system.levels":this.item.system.levels});
			});
		}

		// Action settings managments
		if(this.item.type == "action") {
			// Difficulty
			html.find('.difficulty_addLevel').click(ev => {
				ev.stopPropagation();
				if(!Array.isArray(this.item.system.difficulties))
					this.item.system.difficulties = [];
				let newLevels = this.item.system.difficulties.concat([{level:0, name:"", description:""}]);
				this.item.update({"system.difficulties":newLevels});
			});
			html.find('.difficultyLevel_delete').click(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				ev.stopPropagation();
				this.item.system.difficulties.splice(levelId, 1);
				this.item.update({"system.difficulties":this.item.system.difficulties});
			});
			html.find('.difficultyLevel_value').change(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				this.item.system.difficulties[levelId].level = parseInt($(ev.currentTarget).val());
				this.item.update({"system.difficulties":this.item.system.difficulties});
			});
			html.find('.difficultyName_value').change(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				this.item.system.difficulties[levelId].name = $(ev.currentTarget).val();
				this.item.update({"system.difficulties":this.item.system.difficulties});
			});
			html.find('.difficultyDescription_value').change(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				this.item.system.difficulties[levelId].description = $(ev.currentTarget).val();
				this.item.update({"system.difficulties":this.item.system.difficulties});
			});
			// Significance
			html.find('.significance_addLevel').click(ev => {
				ev.stopPropagation();
				if(!Array.isArray(this.item.system.significances))
					this.item.system.significances = [];
				let newLevels = this.item.system.significances.concat([{level:0, name:"", description:""}]);
				this.item.update({"system.significances":newLevels});
			});
			html.find('.significanceLevel_delete').click(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				ev.stopPropagation();
				this.item.system.significances.splice(levelId, 1);
				this.item.update({"system.significances":this.item.system.significances});
			});
			html.find('.significanceLevel_value').change(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				this.item.system.significances[levelId].level = parseInt($(ev.currentTarget).val());
				this.item.update({"system.significances":this.item.system.significances});
			});
			html.find('.significanceName_value').change(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				this.item.system.significances[levelId].name = $(ev.currentTarget).val();
				this.item.update({"system.significances":this.item.system.significances});
			});
			html.find('.significanceDescription_value').change(ev => {
				let levelId = $(ev.currentTarget).data("levelId");
				this.item.system.significances[levelId].description = $(ev.currentTarget).val();
				this.item.update({"system.significances":this.item.system.significances});
			});
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
