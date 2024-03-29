/**
 * Extend the base Actor entity by defining a custom roll data structure
 * @extends {Actor}
 */
export class PlayerCharacterActor extends Actor {
	/**
	 * Augment the basic actor data with additional dynamic data.
		* 
		* @param {Object} actorData The data for the actor
		* @returns {Object} The actors data
		*/
	prepareData() {
		super.prepareData();

		const data = this.system;
		const items = this.items;
		
		// Capping character points
		if(data.charPoints.value == null)
			data.charPoints.value = 3;
		if(data.charPoints.max == null)
			data.charPoints.max = 3;

		// Filtering items
		data.elements = items.filter(item => item.type === "element");
		data.status = items.filter(item => item.type === "status");
		data.plots = items.filter(item => item.type === "plot");

		// Building description with elements
		let fullDescription = data.description;
		for(let element of data.elements) {
			let source = element.system.source ? element.system.source.trim() : "";
			if(source!="")
				fullDescription = fullDescription.replace(source, `<span class="sysfeerie_element" data-element-id="${element.id}">${source} (${element.system.value})</span>`);
		}
		data.fullDescription = fullDescription;
	}
}