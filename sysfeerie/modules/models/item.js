import { SFUtility } from "../utility.js";
import { Category } from "./category.js";

/**
 * Classe de gestion des items du Système Féerie
 */
export class SFItem extends Item
{
	// Upon creation, assign a blank image if item is new (not duplicated) instead of mystery-man default
	static async create(data, options)
	{
		if (!data.img)
			data.img = SFUtility.getSystemRessource("icons/blank.png");
		super.create(data, options);
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
		let chatData = duplicate(this.data);

		// Don't post any image for the item (which would leave a large gap) if the default image is used
		if (chatData.img.includes("/blank.png"))
			chatData.img = null;

		let category = Category.getCategory(chatData.data.category);
		if(category)
			chatData.data.categoryDescription = category.levels[chatData.data.value];

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