import default_v5_fr from "./default_v5_fr.js";
import solaires_v5_fr from "./solaires_v5_fr.js";
import default_v6_fr from "./default_v6_fr.js";
import cde_v6_fr from "./cde_v6_fr.js";
import tyria_V6 from "./tyria_v6_fr.js";
import chimere_V6 from "./chimere_v6_fr.js";

export default class Presets {
	static _init() {
		if(this._presets)
			return;
		this._presets = [];
		this._presets.push(default_v5_fr);
		this._presets.push(solaires_v5_fr);
		this._presets.push(default_v6_fr);
		this._presets.push(chimere_V6);
		this._presets.push(cde_v6_fr);
		this._presets.push(tyria_V6);
	}

	static getPreset(id, version, lang) {
		this._init();
		let bestMatch = null;
		for(let preset of this._presets) {
			if(preset.id == id && preset.systemVersion == version) {
				if(!bestMatch)
					bestMatch = preset;
				if(preset.lang == lang)
					return preset;
			}
		}
		return bestMatch;
	}

	static getAllPresets() {
		this._init();
		return this._presets;
	}

}