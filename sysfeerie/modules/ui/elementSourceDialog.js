import { SFUtility } from "../utility.js";

export class ElementSourceDialog extends Dialog {

	static open(actor, item) {
		renderTemplate(SFUtility.getSystemRessource("templates/dialog/elementSource-dialog.html")).then(html => {
			let dialog = new ElementSourceDialog({
				title: game.i18n.localize("SYSFEERIE.Dialog.ElementExtractionTitle"),
				content: html,
				buttons: {
					cancel: {
						icon: '<i class="fas fa-times"></i>',
						label: game.i18n.localize("SYSFEERIE.Dialog.Cancel"),
					},
					ok: {
						icon: '<i class="fas fa-check"></i>',
						label: game.i18n.localize("SYSFEERIE.Dialog.OK"),
						callback : ()=> dialog.extractOrUpdateElement()
					}
				},
				default : "ok"
			}, { width:650, classes: ["sysfeerie"] }, actor, item);
			dialog.render(true);
		});
	}

	constructor(dialogData, options, actor, item) {
		super(dialogData, options);
		this._actor = actor;
		this._item = item;

		// Searching existing selection boundaries
		let description = this._actor.system.description;
		if(this._item) {
			let originalSource = this._item.system.source;
			this._originalStart = originalSource ? description.indexOf(originalSource) : -1;
			this._originalEnd = this._originalStart >= 0 ? this._originalStart+originalSource.length : -1;
		} else {
			this._originalStart = -1;
			this._originalEnd = -1;
		}

		// Building the description's fragments
		this._fragments = [];
		this._selectionStart = -1;
		this._selectionEnd = -1;
		let separator = /([\n\t\r ,\.;:?!"«»“”]+)/;
		let tokens = description.split(separator);
		let fragmentStart = 0;
		for(let i=0; i<tokens.length; i++) {
			let token = tokens[i];
			let fragment = {
				index : i,
				text : token,
				isSeparator : token.match(separator),
				start : fragmentStart,
				length : token.length,
				end : fragmentStart+token.length,
				element : null // Will be filled with the html
			};

			if(fragmentStart>=this._originalStart && fragmentStart<this._originalEnd) {
				if(this._selectionStart == -1)
					this._selectionStart = i;
				this._selectionEnd = i+1;
			}

			this._fragments.push(fragment);
			fragmentStart+=token.length;
		}
	}

	
	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Initializing description and source
		this._description = html.find('.elementSource_description');
		this._source = html.find('.elementSource_source');
		let htmlDescription = "";
		for(let fragment of this._fragments) {
			if(fragment.isSeparator)
				htmlDescription += fragment.text;
			else
				htmlDescription += `<span class="elementSource_fragment" data-index="${fragment.index}">${fragment.text}</span>`;
		}
		this._description.html(htmlDescription);
		this._updateSourceAndSelection();

		html.find(".elementSource_fragment").click(ev => {
			let index = parseInt(ev.currentTarget.dataset.index);
			if(this._selectionStart==-1 || index < this._selectionStart || index >= this._selectionEnd) {
				if(index < this._selectionStart || this._selectionStart==-1)
					this._selectionStart = index;
				if(index >= this._selectionEnd)
					this._selectionEnd = index+1;
			} else if(index == this._selectionStart) {
				this._selectionStart += 2;
			} else if(index == this._selectionEnd-1) {
				this._selectionEnd -= 2;
			} else {
				if(index - this._selectionStart <= this._selectionEnd - index)
					this._selectionStart = index;
				else
					this._selectionEnd = index+1;
			}
			if(this._selectionStart>=this._selectionEnd) {
				this._selectionStart = -1;
				this._selectionEnd = -1;
			}
			this._updateSourceAndSelection();
		});

		html.find(".elementSource_clearButton").click(ev => {
			this._selectionStart = this._originalStart;
			this._selectionEnd = this._originalEnd;
			this._updateSourceAndSelection();
		});
	}

	_updateSourceAndSelection() {
		// Updating styles
		this._description.find(".elementSource_fragment").each((i, element) => {
			let index = parseInt(element.dataset.index);
			if(index >= this._selectionStart && index < this._selectionEnd)
				element.classList.add("elementSource_fragment_selected");
			else
				element.classList.remove("elementSource_fragment_selected");
			if(index == this._selectionStart)
				element.classList.add("elementSource_fragment_first");
			else
				element.classList.remove("elementSource_fragment_first");
			if(index == this._selectionEnd-1)
				element.classList.add("elementSource_fragment_last");
			else
				element.classList.remove("elementSource_fragment_last");
		});

		// Updating elements
		if(this._selectionStart>=0) {
			let source = "";
			for(let i=this._selectionStart; i<this._selectionEnd; i++) {
				source += this._fragments[i].text;
			}
			this._source.val(source);
		} else {
			this._source.val("");
		}
	}

	extractOrUpdateElement() {
		let source = this._source.val();
		if(this._item) {
			this._item.update({"system.source" : source});
		} else {
			let data = {
				"type" : "element",
				"img" : `icons/commodities/treasure/bust-carved-stone.webp`,
				"name" : source[0].toUpperCase()+source.slice(1),
				"system.source" : source
			}
			return Item.create(data, {parent: this._actor, renderSheet:true});
		}
	}
}