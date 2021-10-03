export class Category {
	static _initialized = false;
	static _categories = {};

	/**
	 * Return an object with the catgories of the game
	 * @returns {Object.<string, Category>}
	 */
	static getCategories() {
		if(!this._initialized)
			this._init();
		return this._categories;
	}

	/**
	 * @param {string} categoryId 
	 * @returns {Category}
	 */
	static getCategory(categoryId) {
		if(!this._initialized)
			this._init();
		return this._categories[categoryId];
	}

	static async addCategory(id) {
		let category = {
			id : id,
			name : game.i18n.localize(`SYSFEERIE.Categories.DEFAULT.name`),
			short : game.i18n.localize(`SYSFEERIE.Categories.DEFAULT.short`),
			description : game.i18n.localize(`SYSFEERIE.Categories.DEFAULT.description`),
			enabled : true,
			default : false,
			levels : [
				game.i18n.localize(`SYSFEERIE.Categories.DEFAULT.level0`),
				game.i18n.localize(`SYSFEERIE.Categories.DEFAULT.level1`),
				game.i18n.localize(`SYSFEERIE.Categories.DEFAULT.level2`),
				game.i18n.localize(`SYSFEERIE.Categories.DEFAULT.level3`)
			]
		}
		this._categories[id] = category;
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
		if(game.settings.get("sysfeerie", "categories") == '') {
			this._categories = this._generateDefaultsCategories();
			game.settings.set("sysfeerie", "categories", JSON.stringify(this._categories));
		} else {
			this._categories = JSON.parse(game.settings.get("sysfeerie", "categories"));
		}
		this._initialized = true;
	}

	static _generateDefaultsCategories() {
		return {
			"FEATURE" : this._generateDefaultCategory("FEATURE"),
			"PERSONALITY" : this._generateDefaultCategory("PERSONALITY"),
			"CAREER" : this._generateDefaultCategory("CAREER"),
			"NETWORK" : this._generateDefaultCategory("NETWORK"),
			"EQUIPMENT" : this._generateDefaultCategory("EQUIPMENT")
		};
	}

	static _generateDefaultCategory(id) {
		return {
			id : id,
			name : game.i18n.localize(`SYSFEERIE.Categories.${id}.name`),
			short : game.i18n.localize(`SYSFEERIE.Categories.${id}.short`),
			description : game.i18n.localize(`SYSFEERIE.Categories.${id}.description`),
			enabled : true,
			default : true,
			levels : [
				game.i18n.localize(`SYSFEERIE.Categories.${id}.level0`),
				game.i18n.localize(`SYSFEERIE.Categories.${id}.level1`),
				game.i18n.localize(`SYSFEERIE.Categories.${id}.level2`),
				game.i18n.localize(`SYSFEERIE.Categories.${id}.level3`)
			]
		}
	}
}
