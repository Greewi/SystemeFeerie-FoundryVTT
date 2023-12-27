import Consts from "./consts.js";
import { SystemSetting } from "./models/systemSetting.js";
import { SFUtility } from "./utility.js";

/**
 * @typedef {{ Difficulty: number, Score: number, Threshold: number, Result: boolean, HasRoll: boolean, Roll: any, Dice: {value: number, class: string}, SuccessBased: boolean, RollResult: number, AutoSuccess: boolean, AutoFailure: boolean, HasRollRange: boolean, SuccessRange: number }} RollResult
 */

/**
 * This class is in charge of dealing with an action and its messages
 */
export class SystemeFeerieAction {
	/**
	 * @param {ChatMessage} message 
	 * @param {Number} difficulty 
	 */
	constructor(difficulty = 0, significance = 0, message = null, items = [], state = SystemeFeerieAction.STATUS.EMPTY) {
		this.message = message;
		this.items = items;
		this.firstElementRelevance = Consts.RELEVANCE_CONNEXE;
		this.difficulty = difficulty;
		this.significance = significance;
		this.state = state;
	}

	static STATUS = {
		EMPTY: -1,
		PREPARE: 0,
		READY: 1,
		ACK: 2,
		PENDING: 3,
		DONE: 4
	}

	get totalDifficulty() {
		return parseInt(this.difficulty) + parseInt(this.significance);
	}

	get score() {
		let score = 0;
		let items = Array.from(this.items);
		if(!SystemSetting.doesUseElementRelevance()) // When relevance is used, it is the first item's relevance that is examined.
			items.sort((i1,i2)=>i2.system.value - i1.system.value)
		for(let i=0; i<items.length; i++) {
			switch(SystemSetting.getRollScoreMethod()) {
				case Consts.SCORE_SUM :
					score += items[i].system.value;
					break;
				case Consts.SCORE_DEGRESSIVE_SUM :
					score += Math.max(items[i].system.value - i, 0);
					break;
				case Consts.SCORE_MAX_PLUS_COUNT :
					score += i==0 ? items[i].system.value : 1;
					break;
				case Consts.SCORE_SECOND_HALVED_BY_RELEVANCE :
					if(i==0 || this.firstElementRelevance == Consts.RELEVANCE_SPECIFIC)
						score += items[i].system.value - 0;
					else if(this.firstElementRelevance == Consts.RELEVANCE_TYPICAL)
						score += Math.ceil(items[i].system.value/2);
					break;
			}
		}
		return score<6 ? score : 6;
	}

	/**
	 * Returns default ChatMessage datas
	 */
	get cardData() {
		let items = [];
		for(let i=0; i<SystemSetting.getRollMaxElements(); i++) {
			if(i>=this.items.length) {
				items.push({
					Slot : i,
					DisplayItem: "none",
					Placeholder: "grid"
				});
			} else {
				items.push({
					Slot : i,
					DisplayItem: "grid",
					Placeholder: "none",
					img: this.items[i].img,
					name: this.items[i].name,
					value: this.items[i].system.value,
					actorName: this.items[i].actor.name,
					Unresolved: this.state != SystemeFeerieAction.STATUS.DONE
				});
			}
		}

		let relevances = {};
		relevances[Consts.RELEVANCE_CONNEXE] = "SYSFEERIE.Relevance.CONNEXE";
		relevances[Consts.RELEVANCE_TYPICAL] = "SYSFEERIE.Relevance.TYPICAL";
		relevances[Consts.RELEVANCE_SPECIFIC] = "SYSFEERIE.Relevance.SPECIFIC";

		return {
			Difficulty: this.difficulty,
			Significance: this.significance,
			TotalDifficulty: this.totalDifficulty,
			CharacterScore: this.score,
			ActionScore: this.totalDifficulty,
			NeedRelevance: SystemSetting.doesUseElementRelevance(),
			FirstItemRelevance: this.firstElementRelevance,
			FirstItemRelevanceText:  game.i18n.localize(`SYSFEERIE.Relevance.${this.firstElementRelevance}`),
			Relevances:relevances,
			Items: items,
			Unresolved:this.state != SystemeFeerieAction.STATUS.DONE
		};
	}

	/**
	 * Check the action status before a change is supposed to happen to the action
	 */
	checkActionStatus() {
		if (this.state >= SystemeFeerieAction.STATUS.DONE)
			return;
		if (this.state == SystemeFeerieAction.STATUS.ACK)
			SystemeFeerieAction.updateGMAck(false);
	}

	/**
	 * Set an item to a slot and update the message card
	 * @param {SFItem} item 
	 */
	setItem(item) {
		this.checkActionStatus();
		if(this.items.length >= SystemSetting.getRollMaxElements())
			return;
		for(let itemUsed of this.items)
			if(itemUsed == item)
				return;
		this.items.push(item);
		this.updateChatCard();
		this.saveAction();
	}

	/**
	 * Remove an item from an ongoing action
	 * @param {Number} slot 
	 */
	removeItem(slot) {
		this.checkActionStatus();
		if(slot>=this.items.length)
			return;
		this.items.splice(slot, 1);
		this.updateChatCard();
		this.saveAction();
	}

	/**
	 * Change the relevance of the first element chosen for the action
	 * @param {string} relevance the relevance of the first element chosen for the action
	 */
	static async setRelevance(relevance) {
		if (game.user.isGM) {
			game.systemeFeerie.pendingAction.firstElementRelevance = relevance;
			game.systemeFeerie.pendingAction.updateChatCard();
			game.systemeFeerie.pendingAction.saveAction();
			game.socket.emit("system.sysfeerie", {
				type: "updateRelevance",
				payload: {
					relevance: relevance
				}
			});
		}
	}

	/**
	 * Change the "GM ackowledge" checkmark of an action
	 * @param {Boolean} ack 
	 */
	static async updateGMAck(ack) {
		if(ack)
			document.querySelector('.checkMark').classList.replace("fa-question-circle", "fa-check-circle");
		else
			document.querySelector('.checkMark').classList.replace("fa-check-circle", "fa-question-circle");

		if (game.user.isGM) {
			game.socket.emit("system.sysfeerie", {
				type: "updateGMAck",
				payload: {
					ack: ack
				}
			});
		}
	}

	/**
	 * Create a ChatMessage when an action begins
	 */
	createChatCard() {
		let data = this.cardData;
		renderTemplate(SFUtility.getSystemRessource("templates/chat/begin-action.html"), data).then(html => {
			let chatOptions = SFUtility.chatDataSetup(html);
			ChatMessage.create(chatOptions).then(msg => {
				this.message = msg;
				this.state = SystemeFeerieAction.STATUS.PREPARE;
				this.saveAction();
			});
		});
	}

	/**
	 * Update the ChatMessage with the current data on the action
	 */
	updateChatCard() {
		let data = this.cardData;
		renderTemplate(SFUtility.getSystemRessource("templates/chat/begin-action.html"), data).then(html => {
			this.message.update({
				content: html
			}).then(newMsg => {
				this.message = newMsg;
				if(this.state == SystemeFeerieAction.STATUS.DONE)
					game.systemeFeerie.pendingAction = null;
			});
		});
	}

	/**
	 * Save an ongoing action on the GM computer for a future reload
	 */
	saveAction() {
		if (game.user.isGM) {
			localStorage.setItem('pendingAction', this.toJSON());
		}
	}

	/** 
	 * Clean the "begin" message after an action has been resolved
	 */
	cleanAction(){
		this.state = SystemeFeerieAction.STATUS.DONE;
		this.updateChatCard();
		SystemeFeerieAction.deleteSave();
	}

	static deleteSave() {
		localStorage.removeItem('pendingAction');
	}

	/**
	 * Returns raw data that are needed to deserialize a SystemeFeerieAction from a string
	 */
	toJSON() {
		let items = [];
		for(let item of this.items) {
			items.push({
				item : item ? item.id : null,
				actor : item ? item.actor.id : null
			});
		}
		return JSON.stringify({
			message: this.message ? this.message.id : null,
			items : items,
			difficulty: this.difficulty,
			significance: this.significance,
			state: this.state
		});
	}

	/**
	 * Deserialize a JSON string into a SystemeFeerieAction object
	 * @param {String} json 
	 */
	static fromJSON(json) {
		let data = JSON.parse(json);
		let items = [];

		let message = game.messages.get(data.message);
		if (!message) {
			SystemeFeerieAction.deleteSave();
			return null;
		}
		
		for(let item of data.items) {
			if(item && item.actor && item.item)
				items.push(game.actors.get(item.actor).items.get(item.item));
		}

		return new SystemeFeerieAction(data.difficulty, data.significance, message, items, data.state);
	}

	/**
	 * Create a RollMessage and resolve the action
	 * @param {Number} difficulty
	 * @param {Number} score
	 */
	static async resolveAction(difficulty, score){
		let data;
		if(SystemSetting.getSystemVersion()==5)
			data = await this._resolveActionV5(difficulty, score);
		else if(SystemSetting.getSystemVersion()==6)
			data = await this._resolveActionV6(difficulty, score);
		else {
			this._cleanAction();
			return;
		}

		if(data.Result){
			if(!data.HasRoll)
				data.autoSuccess = true;
			data.ClassActionResult = "resolve-action-success";
			data.TextActionResult = `<i class="fas fa-check"></i> ${game.i18n.localize("SYSFEERIE.Chat.ResultSuccess")}`;
		}
		else {
			if(!data.HasRoll)
				data.autoFail = true;
			data.ClassActionResult = "resolve-action-failed";
			data.TextActionResult = `<i class="fas fa-times"></i> ${game.i18n.localize("SYSFEERIE.Chat.ResultFailed")}`;
		}

		renderTemplate(SFUtility.getSystemRessource("templates/chat/resolve-action.html"), data).then(html => {
			let chatOptions = SFUtility.chatDataSetup(html, null, data.HasRoll);
			chatOptions.roll = data.Roll;
			ChatMessage.create(chatOptions).then(msg => {
				this._cleanAction();
			});
		});
	}

	static _cleanAction() {
		if(game.user.isGM)
			game.systemeFeerie.pendingAction.cleanAction();
		else{
			game.socket.emit("system.sysfeerie", {
				type: "cleanAction"
			});
		}
	}

	/**
	 * @param {number} difficulty 
	 * @param {number} score 
	 * @returns {Promise<RollResult>}
	 */
	static async _resolveActionV5(difficulty, score) {
		let threshold = difficulty+score;
		let needRoll = threshold > 0 && threshold < 6;

		let result = threshold >= 6;
		let successCount = 0;
		let dice = null;
		let roll = null;
		if(needRoll){
			roll = await new Roll(`3d6cs<=${threshold}`).roll();
			successCount = parseInt(roll.result,10);
			dice = roll.dice[0].results.map(obj => {
				return {value:obj.result,class:obj.success ? "resolve-action-roll-success":"resolve-action-roll-failed"};
			});
			result = successCount >= 2;
		}

		return {
			Difficulty: difficulty,
			Score: score,
			Threshold : threshold,
			Result: result,

			HasRoll: needRoll,
			Roll: roll,
			Dice: dice,
			SuccessBased:true,
			RollResult: successCount,
			AutoSuccess: !needRoll && result,
			AutoFailure: !needRoll && !result,

			HasRollRange: false,
			SuccessRange: 0,
			SuccessQuality: game.i18n.localize(result?"SYSFEERIE.Chat.DiceResultNormalSuccess":"SYSFEERIE.Chat.DiceResultNormalFailure")
		};
	}

	/**
	 * @param {number} difficulty 
	 * @param {number} score 
	 * @returns {Promise<RollResult>}
	 */
	static async _resolveActionV6(difficulty, score) {
		let threshold = difficulty-score;

		let roll = await new Roll(`3d6dhdl`).roll();
		let rollDice = Array.from(roll.dice[0].results).sort((a,b)=>a.result-b.result);
		let rollResult = parseInt(roll.result,10);
		let result = rollResult>threshold;
		let successRange = rollResult - threshold;
		let dice = [];
		for(let d=0; d<rollDice.length; d++) {
			dice.push({
				value: rollDice[d].result,
				class: `${parseInt(rollDice[d].result, 10)>threshold?"resolve-action-roll-success":"resolve-action-roll-failed"}${d!=1?" resolve-action-roll-discarded":""}`
			});
		}
		let successQuality = "";
		if(successRange>=3)
			successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultGreaterSuccess");
		else if(successRange>=2)
			successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultNormalSuccess");
		else if(successRange>=1)
			successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultLowerSuccess");
		else if(successRange>=0)
			successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultLowerFailure");
		else if(successRange>=-1)
			successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultNormalFailure");
		else
			successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultGreaterFailure");

		return {
			Difficulty: difficulty,
			Score: score,
			Threshold : threshold,
			Result: result,

			HasRoll: true,
			Roll: roll,
			Dice: dice,
			SuccessBased:false,
			RollResult: rollResult,
			AutoSuccess: false,
			AutoFailure: false,

			HasRollRange: true,
			SuccessRange: successRange,
			SuccessQuality: successQuality
		};
	}

}