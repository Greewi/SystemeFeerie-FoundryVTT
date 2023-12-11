import { SystemSetting } from "../models/systemSetting.js";
import { SFDialogs } from "../ui/dialogs.js";
import { SFUtility } from "../utility.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SFActorSheet extends ActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sysfeerie", "sheet", "actor"],
			template: SFUtility.getSystemRessource("templates/character-sheet.html"),
			width: 600,
			height: 650,
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
			dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
		});
	}

	/**
	 * @override
	 */
	get template() {
		if(this.actor.type == "playerCharacter")
			return SFUtility.getSystemRessource("templates/character-sheet.html");
		return SFUtility.getSystemRessource("templates/item-sheet.html");
	}

	/**
	 * @override
	 */
	getData() {
		const actorData = super.getData();
		if(actorData.data.type == "playerCharacter") {
			// Sorting elements by categories
			actorData.data.system.sortedElements = {};
			for(let element of actorData.data.system.elements) {
				let category = SystemSetting.getCategory(element.system.category);
				if(category) {
					if(!actorData.data.system.sortedElements[category.id])
						actorData.data.system.sortedElements[category.id] = [];
					actorData.data.system.sortedElements[category.id].push(element);
				} else {
					if(!actorData.data.system.sortedElements["UNSORTED"])
						actorData.data.system.sortedElements["UNSORTED"] = [];
					actorData.data.system.sortedElements["UNSORTED"].push(element);
				}
			}
		}
		return actorData;
	}

	/**
	 * @override
	 */
	activateListeners(html) {
		super.activateListeners(html);

		// open char points infos
		html.find('.charMain_CharPoints_infos').click(ev => {
			SFDialogs.openCharPointInfos();
		});

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;

		// Edit description
		let descZone = html.find('.charDesc');
		let editZone = html.find('.charDescEdit');
		html.find('.charDesc_editButton').click(ev => {
			descZone.toggleClass("charDesc_edit");
			editZone.toggleClass("charDescEdit_edit");
		});

		// Extract an element
		html.find('.charDesc_extractButton').click(ev => {
			SFDialogs.extactElement(this.actor);
		});

		// change charpoints amounts
		html.find('.charMain_charPoints_value').mouseup(ev => {
			let val = this.actor.system.charPoints.value;
			let max = this.actor.system.charPoints.max;
			if(ev.button == 0) val++;
			if(ev.button == 2) val--;
			if(val>max) val = max;
			if(val<0) val = 0;
			this.actor.update({"system.charPoints.value" : val});
		});
		html.find('.charMain_charPoints_maxValue').mouseup(ev => {
			let val = this.actor.system.charPoints.value;
			let max = this.actor.system.charPoints.max;
			if(ev.button == 0) max++;
			if(ev.button == 2) max--;
			if(max<0) max = 0;
			if(val>max) val = max;
			if(val<0) val = 0;
			this.actor.update({"system.charPoints.value" : val, "system.charPoints.max" : max});
		});

		// Add status
		html.find('.charStatus_addButton').click(ev => {
			ev.preventDefault();
			let header = ev.currentTarget,
			data = duplicate(header.dataset);
			
			data["type"] = `status`;
			data["img"] = `icons/skills/wounds/injury-body-pain-gray.webp`;
			data["name"] = `${game.i18n.localize("SYSFEERIE.Status.New")}`;
			ev.stopPropagation();
			return Item.create(data, {parent: this.actor, renderSheet:true});
		});

		// Add element
		html.find('.charElement_addButton').click(ev => {
			ev.preventDefault();
			let header = ev.currentTarget,
			data = duplicate(header.dataset);
			
			data["type"] = `element`;
			data["category"] = SystemSetting.getCategories()[0].id;
			data["img"] = SystemSetting.getCategories()[0].icon;
			data["name"] = `${game.i18n.localize("SYSFEERIE.Status.New")}`;
			ev.stopPropagation();
			return Item.create(data, {parent: this.actor, renderSheet:true});
		});

		// Post item/status
		html.find('.item-post').click(ev => {
			let itemId = $(ev.currentTarget).parents(".item").data("itemId");
			const item = this.actor.items.find(i => i._id == itemId);
			item.postItem();
			ev.stopPropagation();
		});

		// Update item/status
		html.find('.item-edit').click(ev => {
			const li = ev.currentTarget.tagName=="LI" ? $(ev.currentTarget) : $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
			ev.stopPropagation();
		});

		// Delete item/status
		html.find('.item-delete').click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			this.actor.deleteEmbeddedDocuments("Item",[li.data("itemId")]);
			li.slideUp(200, () => this.render(false));
			ev.stopPropagation();
		});

		// Add plot
		html.find('.charPlot_addButton').click(ev => {
			ev.preventDefault();
			let header = ev.currentTarget,
			data = duplicate(header.dataset);
			
			data["type"] = `plot`;
			data["img"] = `icons/sundries/documents/document-sealed-signatures-red.webp`;
			data["name"] = `${game.i18n.localize("SYSFEERIE.Plot.New")}`;
			ev.stopPropagation();
			return Item.create(data, {parent: this.actor, renderSheet:true});
		});

		// Use an element for the action resolution system
		const addItemToAction = (itemId)=>{
			let item = this.actor.items.find(i => i._id == itemId);
			if (game.user.isGM && game.systemeFeerie.pendingAction)
				game.systemeFeerie.pendingAction.setItem(item);
			else {
				game.socket.emit("system.sysfeerie", {
					type: "setItem",
					payload: {
					idItem: itemId,
					idActor: this.actor.id
					}
				});
			}
		};
		html.find('.item-name').click(ev => {
			addItemToAction($(ev.currentTarget).parents(".item").data("itemId"));
			ev.stopPropagation();
		});
		html.find('.sysfeerie_element').click(ev => {
			addItemToAction($(ev.currentTarget).data("elementId"));
			ev.stopPropagation();
		});
	}

	/**
	 * @override
	 */
	_createEditor(target, editorOptions, initialContent) {
		editorOptions.content_css = SFUtility.getSystemRessource("styles/mce.css");
		return super._createEditor(target, editorOptions, initialContent);
	}
}
