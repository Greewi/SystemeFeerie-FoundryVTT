export class SFUtility
{
	static getSystemRessource(relativePath) {
		return "systems/sysfeerie/"+relativePath;
	}

	static duplicate(...args) {
		if(foundry?.utils?.duplicate)
			return foundry.utils.duplicate(...args);
		else
			return duplicate(...args);
	}

	static mergeObject(...args) {
		if(foundry?.utils?.mergeObject)
			return foundry.utils.mergeObject(...args);
		else
			return this.mergeObject(...args);
	}
}