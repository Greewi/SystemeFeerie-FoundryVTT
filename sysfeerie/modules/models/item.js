import { SFUtility } from "../utility.js";
import { SystemSetting } from "./systemSetting.js";

/**
 * Classe de gestion des items du Système Féerie
 */
export class SFItem extends Item
{
	// Upon creation, assign a blank image if item is new (not duplicated) instead of mystery-man default
	static async create(data, options)
	{
		if (!data.img) {
			if(data.type == "information")
				data.img = "icons/sundries/documents/document-official-brownl.webp";
			if(data.type == "ressource")
				data.img = "icons/commodities/currency/coins-shield-sword-stack-silver.webp";
			else if(data.type == "plot")
				data.img = "icons/sundries/documents/document-sealed-signatures-red.webp";
			else {
				let categories = game.items.filter(item => item.type === "category");
				let category = categories[0];
				if(category)
					data.img = category.img;
				else 
					data.img = "icons/sundries/documents/envelope-sealed-red-tan.webp";
			}
		}
		super.create(data, options);
	}

	/**
	 * Define the name to display in the sidebar (to display the information value)
	 */
	get nameForSidebar() {
		if(this.type=="information" && this.system.value)
			return `${this.name} (${this.system.value})`;
		return this.name;
	}

	/**
	 * Augment the basic item data with additional dynamic data.
	 * 
	 * @param {Object} actorData The data for the actor
	 * @returns {Object} The actors data
	 */
	prepareData() {
		super.prepareData();
		if(this.type == "element") {
			let categories = game.items.filter(item => item.type === "category");
			let category = categories.find(cat => cat.id === this.system.category);
			if(category)
				this.img = category.img;
			else 
				this.img = "icons/sundries/documents/envelope-sealed-red-tan.webp";
		}
	}

	/**
	 * Is this item a status element
	 * 
	 * @returns {boolean} true if and only this item is a status element
	 */
	isStatus() {
		if(this.type != "element")
			return false;

		let categories = game.items.filter(item => item.type === "category");
		let category = categories.find(cat => cat.id === this.system.category);
		return category.system.isStatus;
	}

	/**
	* Posts this item to chat.
	* 
	* postItem() prepares this item's chat data to post it to chat, setting up 
	* the image if it exists, as well as setting flags so drag+drop works.
	* 
	*/
	postItem()
	{
		let chatData = duplicate(this.system);
		chatData.name = this.name;
		chatData.img = (!chatData.img || this.img.includes("/blank.png")) ? null : this.img; // Don't post any image for the item (which would leave a large gap) if the default image is used
		if(this.type == "element") {
			let categories = game.items.filter(item => item.type === "category");
			let category = categories.find(cat => cat.id === this.system.category);
			if(category)
				chatData.img = category.img;
			else 
				chatData.img = "icons/sundries/documents/envelope-sealed-red-tan.webp";
		}

		let categories = game.items.filter(item => item.type === "category");
		let category = categories.find(cat => cat.id === this.system.category);
		if(category) {
			chatData.categoryName = category.name;
			let categorySplit = category.system.levels[parseInt(chatData.value)].replace(" "," ").split(":");
			chatData.categoryLevel = categorySplit.length>1 ? categorySplit.shift()+":" : "";
			chatData.categoryDescription = categorySplit.join(":");
		}

		renderTemplate(SFUtility.getSystemRessource("templates/chat/post-item.html"), chatData).then(html =>
		{
			let chatOptions = SFUtility.chatDataSetup(html)
			// Setup drag and drop data
			chatOptions["flags.transfer"] = JSON.stringify(
			{
				data: chatData,
				postedItem: true
			});
			ChatMessage.create(chatOptions);
		});
	}
}