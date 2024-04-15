import { SFUtility } from "../utility.js";
import Presets from "../presets/preset.js";
import { SystemSetting } from "../models/systemSetting.js";

export class SettingLoadPresetDialog extends FormApplication {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sysfeerie"],
			template: SFUtility.getSystemRessource("templates/dialog/settingLoadPreset-dialog.html"),
			id:'settings_loadpreset',
			title:game.i18n.localize("SYSFEERIE.Settings.Presets"),
			resizable:true,
			width: 650,
			height: 205
		});
	}

	/**
	 * @override
	 */
	getData() {
		const data = super.getData();

		// Aggregating preset
		let aggregatedPreset = new Map();
		for(let presetInfos of Presets.getAllPresets()) {
			let presetKey = `${presetInfos.id}-v${presetInfos.systemVersion}`;
			if(!aggregatedPreset.has(presetKey) || presetInfos.lang==game.i18n.lang)
				aggregatedPreset.set(presetKey, presetInfos);
		}

		// Building data for the dialog
		let presets = [];
		aggregatedPreset.forEach((presetInfos)=>{
			presets.push({
				id:presetInfos.id,
				name:presetInfos.name,
				systemVersion:presetInfos.systemVersion,
				lang:presetInfos.lang
			});
		});
		presets.sort((p1, p2) => {
			if(p1.id=="default")
				return -1;
			if(p2.id=="default")
				return 1;
			if(p1.name<p2.name)
				return -1;
			if(p1.name>p2.name)
				return 1;
			return p1.systemVersion - p2.systemVersion;
		});

		data.presets = presets;
		return data;
	}

	async _updateObject(event, formData) {
		if (!await Dialog.confirm({
			content: game.i18n.localize("SYSFEERIE.Settings.LoadPresetConfirmation"),
		})) {
			return;
		}
		
		let presetData = formData[`data.preset`].split("-");
		let presetId = presetData[0];
		let systemVersion = parseInt(presetData[1]);
		SystemSetting.loadPreset(presetId, systemVersion);
	}
}
