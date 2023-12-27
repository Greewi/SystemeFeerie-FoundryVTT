import Consts from "../consts.js";
import Presets from "../presets/preset.js";

/**
 * @typedef {{score:number, name:string, description:string}} Difficulty
 * @typedef {{id:string, name:string, icon:string, short:string, description:string, levels:string[]}} Category
 * @typedef {{
 *     id:string,
 *     name:string,
 *     systemVersion:number,
 *     lang:string,
 *     rolls : {maxElementNumber:number, scoreMethod:string},
 *     difficulties:Difficulty[],
 *     signifiances:Difficulty[],
 *     categories:Category[]
 * }} SystemSettingInfos
 */

const difficultiesIcons = [
	"fas fa-cookie-bite",
	"fas fa-grin-beam-sweat",
	"fas fa-hard-hat",
	"fas fa-fire-alt",
	"fas fa-pray"
];
const signifiancesIcons = [
	"fas fa-check-double",
	"fas fa-check",
	"fas fa-grip-lines",
	"fas fa-times",
	"fas fa-skull-crossbones"
];

/**
 * Model for the system settings
 */
export class SystemSetting {

	static SUM = "SUM";
	static DEGRESSIVE_SUM = "DEGRESSIVE_SUM";
	static MAX_PLUS_COUNT = "MAX_PLUS_COUNT";

	/**
	 * @type {SystemSettingInfos}
	 */
	static _systemSettings = null;

	/**
	 * @returns {string} the system id
	 */
	static getSystemId() {
		this._init();
		return this._systemSettings.id;
	}

	/**
	 * @param {string} id the id to set
	 */
	static setSystemId(id) {
		this._init();
		this._systemSettings.id = id;
		this._save();
	}

	/**
	 * @returns {string} the system localized name
	 */
	static getSystemName() {
		this._init();
		return this._systemSettings.name;
	}

	/**
	 * @param {string} name the system's name
	 */
	static setSystemName(name) {
		this._init();
		this._systemSettings.name = name;
		this._save();
	}

	/**
	 * @returns {string} the system language
	 */
	static getSystemLang() {
		this._init();
		return this._systemSettings.lang;
	}

	/**
	 * @param {string} lang the system's language
	 */
	static setSystemLang(lang) {
		this._init();
		this._systemSettings.lang = lang;
		this._save();
	}

	/**
	 * @returns {number} the system version (5 or 6)
	 */
	static getSystemVersion() {
		this._init();
		return this._systemSettings.systemVersion;
	}

	/**
	 * @returns {number} the maximum number of element that can be used at once in a roll
	 */
	static getRollMaxElements() {
		this._init();
		return this._systemSettings.rolls.maxElementNumber;
	}

	/**
	 * @param {number} maxElementNumber the maximum number of element that can be used at once in a roll
	 */
	static setRollMaxElements(maxElementNumber) {
		this._init();
		this._systemSettings.rolls.maxElementNumber = maxElementNumber;
		this._save();
	}

	/**
	 * @returns {string} the method use to compute the character score using the elements (SUM, DEGRESIVE_SUM)
	 */
	static getRollScoreMethod() {
		this._init();
		return this._systemSettings.rolls.scoreMethod;
	}

	/**
	 * @param {string} scoreMethod the method use to compute the character score using the elements (SUM, DEGRESIVE_SUM)
	 */
	static setRollScoreMethod(scoreMethod) {
		this._init();
		this._systemSettings.rolls.scoreMethod = scoreMethod;
		this._save();
	}

	/**
	 * @returns {boolean} true if the system need the GM to assess the relevance of an element when resolving a roll
	 */
	static doesUseElementRelevance() {
		this._init();
		return this.getRollScoreMethod() == Consts.SCORE_SECOND_HALVED_BY_RELEVANCE;
	}

	/**
	 * @returns {Difficulty[]} an array with the difficulties
	 */
	static getDifficulties() {
		this._init();
		for(let i=0; i<this._systemSettings.difficulties.length; i++)
			this._systemSettings.difficulties[i].icon = difficultiesIcons[Math.round(i*difficultiesIcons.length/this._systemSettings.difficulties.length)];
		return this._systemSettings.difficulties;
	}

	/**
	 * @returns {Difficulty[]} an array with the signifiances
	 */
	static getSignifiances() {
		this._init();
		for(let i=0; i<this._systemSettings.signifiances.length; i++)
			this._systemSettings.signifiances[i].icon = signifiancesIcons[Math.round(i*signifiancesIcons.length/this._systemSettings.signifiances.length)];
		return this._systemSettings.signifiances;
	}
	
	/**
	 * @returns {Category[]}  an array containing the catgories of the game
	 */
	static getCategories() {
		this._init();
		return this._systemSettings.categories;
	}

	/**
	 * @param {string} categoryId 
	 * @returns {Category}
	 */
	static getCategory(categoryId) {
		this._init();
		for(let category of this._systemSettings.categories) {
			if(category.id == categoryId)
				return category;
		}
		return undefined;
	}

	static async addCategory(id) {
		let category = {
			id : id,
			name : game.i18n.localize(`SYSFEERIE.DefaultCategories.name`),
			short : game.i18n.localize(`SYSFEERIE.DefaultCategories.short`),
			description : game.i18n.localize(`SYSFEERIE.DefaultCategories.description`),
			levels : [
				game.i18n.localize(`SYSFEERIE.DefaultCategories.level0`),
				game.i18n.localize(`SYSFEERIE.DefaultCategories.level1`),
				game.i18n.localize(`SYSFEERIE.DefaultCategories.level2`),
				game.i18n.localize(`SYSFEERIE.DefaultCategories.level3`)
			]
		}
		if(this.getSystemVersion() == 5) {
			for(let level=0; level<=3; level++)
				category.levels.push(game.i18n.localize(`SYSFEERIE.Categories.DEFAULTV5.level${level}`));
		} else if(this.getSystemVersion() == 6) {
			for(let level=0; level<=4; level++)
				category.levels.push(game.i18n.localize(`SYSFEERIE.Categories.DEFAULTV6.level${level}`));
		}
		this._systemSettings.categories.push(category);

		return game.settings.set("sysfeerie", "categories", JSON.stringify(this._categories));
	}

	static async removeCategory(id) {
		if(!this._categories[id] || this._categories[id].default)
			return;
		delete this._categories[id];
		return game.settings.set("sysfeerie", "categories", JSON.stringify(this._categories));
	}

	static async updateCategory(id, update) {
		if(!this._categories[id])
			return;
		for(let property in update)
			if(property=="enabled" || !this._categories[id].default)
				this._categories[id][property] = update[property];
		return game.settings.set("sysfeerie", "categories", JSON.stringify(this._categories));
	}

	static _init() {
		if(this._systemSettings)
			return;
		if(true || game.settings.get("sysfeerie", "systemSetting") == '') {
			this._systemSettings = Presets.getPreset("default", 6, game.i18n.lang);
			this._save();
		} else {
			this._systemSettings = JSON.parse(game.settings.get("sysfeerie", "systemSetting"));
		}
	}

	static _save() {
		game.settings.set("sysfeerie", "systemSetting", JSON.stringify(this._systemSettings));
	}

}