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
			if(data.type == "status")
				data.img = "icons/skills/wounds/injury-body-pain-gray.webp";
			else if(data.type == "plot")
				data.img = "icons/sundries/documents/document-sealed-signatures-red.webp";
			else {
				if(SystemSetting.getCategory(data.category))
					data.img = SystemSetting.getCategory(data.category).icon;
				else 
					data.img = "icons/sundries/documents/envelope-sealed-red-tan.webp";
			}
		}
		super.create(data, options);
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
			if(SystemSetting.getCategory(this.system.category))
				this.img = SystemSetting.getCategory(this.system.category).icon;
			else 
				this.img = "icons/sundries/documents/envelope-sealed-red-tan.webp";
		}
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
			if(SystemSetting.getCategory(this.system.category))
				chatData.img = SystemSetting.getCategory(this.system.category).icon;
			else 
				chatData.img = "icons/sundries/documents/envelope-sealed-red-tan.webp";
		}

		let category = SystemSetting.getCategory(chatData.category);
		if(category) {
			chatData.categoryName = category.name;
			let categorySplit = category.levels[parseInt(chatData.value)].replace(" "," ").split(":");
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