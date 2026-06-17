import Consts from "./consts.js";
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
	 * @param {number} difficulty 
	 */
	constructor(action, difficulty = 0, difficultyMod = 0) {
		this.actionId = action;
		this.difficulty = difficulty;
		this.difficultyMod = difficultyMod;
		this.bonusId = 0;
		this.scoreBonuses = this.action.system.scoreBonuses;
		this.message = null;
		this.items = [];
		this.state = SystemeFeerieAction.STATUS.EMPTY;
	}

	static STATUS = {
		EMPTY: -1,
		PREPARE: 0,
		READY: 1,
		ACK: 2,
		PENDING: 3,
		DONE: 4
	}

	get action() {
		return game.items.find(item => item.id === this.actionId);
	}

	useScoreBonus() {
		return this.action.system.version==6;
	}

	get totalDifficulty() {
		return parseInt(this.difficulty) + parseInt(this.difficultyMod);
	}

	get score() {
		let score = 0;
		let items = Array.from(this.items);
		items.sort((i1,i2)=>(i2.system.value - i1.system.value));
		for(let i=0; i<items.length; i++) {
			switch(this.action.system.scoreMethod) {
				case Consts.SCORE_SUM :
				case Consts.SCORE_SUM_PLUS_BONUS :
					score += items[i].system.value;
					break;
				case Consts.SCORE_DEGRESSIVE_SUM :
					score += Math.max(items[i].system.value - i, 0);
					break;
				case Consts.SCORE_MAX_PLUS_COUNT :
					score += i==0 ? items[i].system.value : 1;
					break;
			}
		}
		if(this.action.system.scoreMethod == Consts.SCORE_SUM_PLUS_BONUS && this.scoreBonuses && this.scoreBonuses[this.bonusId] && this.scoreBonuses[this.bonusId].level)
			score += this.scoreBonuses[this.bonusId].level;
		if(this.action.system.scoreMethod == Consts.SCORE_DEGRESSIVE_SUM || this.action.system.scoreMethod == Consts.SCORE_MAX_PLUS_COUNT)
			score = score<6 ? score : 6;
		return score;
	}

	/**
	 * Returns default ChatMessage datas
	 */
	get cardData() {
		let items = [];
		for(let i=0; i<this.action.system.maxElementNumber; i++) {
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

		let bonuses = {};
		if(this.useScoreBonus()) {
			for(let bonusId = 0 ; bonusId<this.scoreBonuses.length ; bonusId++)
				bonuses[bonusId] = this.scoreBonuses[bonusId].name;
		}

		return {
			Action: this.action,
			Difficulty: this.difficulty,
			DifficultyMod: this.difficultyMod,
			TotalDifficulty: this.totalDifficulty,
			CharacterScore: this.score,
			NeedBonus: this.useScoreBonus(),
			Bonuses: bonuses,
			BonusId: this.bonusId,
			BonusText: (this.scoreBonuses && this.scoreBonuses[this.bonusId]) ? this.scoreBonuses[this.bonusId].name : "",
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
		if(this.items.length >= this.action.system.maxElementNumber)
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
	 * @param {number} slot 
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
	 * Change the bonus of the score
	 * @param {string} bonusId the bonus index to set
	 */
	static async setBonus(bonusId) {
		if (game.user.isGM) {
			game.systemeFeerie.pendingAction.bonusId = bonusId;
			game.systemeFeerie.pendingAction.updateChatCard();
			game.systemeFeerie.pendingAction.saveAction();
			game.socket.emit("system.sysfeerie", {
				type: "updateBonus",
				payload: {
					bonusId: bonusId
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
			ChatMessage.create({
				user: game.user.id,
				content:html
			}).then(msg => {
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
			action: this.actionId,
			items : items,
			difficulty: this.difficulty,
			difficultyMod: this.difficultyMod,
			bonusId: this.bonusId,
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

		let action = new SystemeFeerieAction(data.action, data.difficulty, data.difficultyMod);
		action.bonusId = data.bonusId;
		action.message = message;
		action.items = items;
		action.state = data.state;
		return action;
	}

	/**
	 * Create a RollMessage and resolve the action
	 * @param {string} actionId action id
	 * @param {number} difficulty
	 * @param {number} score
	 * @param {boolean} isOpposition if true, this is an opposition roll
	 * @param {number} opponentDifficulty the difficulty for the opponent
	 * @param {number} opponentScore the rating score of the opponent
	 */
	static async resolveAction(actionId, difficulty, score, isOpposition, opponentDifficulty, opponentScore) {
		let data;
		let action = game.items.find(item => item.id === actionId);
		if(action.system.version==5)
			data = await this._resolveActionV5(action, difficulty, score, isOpposition, opponentDifficulty, opponentScore);
		else if(action.system.version==6)
			data = await this._resolveActionV6(action, difficulty, score, isOpposition, opponentDifficulty, opponentScore);
		else {
			this._cleanAction();
			return;
		}

		renderTemplate(SFUtility.getSystemRessource("templates/chat/resolve-action.html"), data).then(html => {
			let chatOptions = {
				user: game.user.id,
				content:html,
				isRoll:true,
				rolls : [data.Roll]
			}
			if(data.Opponent && data.Opponent.HasRoll) {
				data.Roll.dice[0].options.rollOrder = 1;
				data.Opponent.Roll.dice[0].options.rollOrder = 2;
				data.Opponent.Roll.dice[0].options.appearance = {
					"colorset": "custom",
					"font": "Arial Black",
					"foreground": "#220000",
					"background": "#FF3300",
					"outline": "#FF3300",
					"edge": "#FF3300",
					"texture": "stars",
					"material": "metal",
					"system": "standard",//"dot" make D6 lose faces
				};
				
				chatOptions.roll = Roll.fromTerms([PoolTerm.fromRolls([data.Roll, data.Opponent.Roll])]);
			} else {
				chatOptions.roll = data.Roll;
			}
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
	 * @param {SFItem} action action
	 * @param {number} difficulty 
	 * @param {number} score 
	 * @returns {Promise<RollResult>}
	 */
	static async _resolveActionV5(action, difficulty, score) {
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
			Action: action,
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
			SuccessQuality: game.i18n.localize(result?"SYSFEERIE.Chat.DiceResultNormalSuccess":"SYSFEERIE.Chat.DiceResultNormalFailure"),

			ClassActionResult: result? "resolve-action-success" : "resolve-action-failed",
			TextActionResult: result? `<i class="fas fa-check"></i> ${game.i18n.localize("SYSFEERIE.Chat.ResultSuccess")}` : `<i class="fas fa-times"></i> ${game.i18n.localize("SYSFEERIE.Chat.ResultFailed")}`,
		};
	}

	/**
	 * @param {SFItem} action action
	 * @param {number} difficulty 
	 * @param {number} score 
	 * @returns {Promise<RollResult>}
	 */
	static async _resolveActionV6(action, difficulty, score) {
		let threshold = difficulty-score;

		let roll = await new Roll(`3d6dhdl`).roll();
		let rollDice = Array.from(roll.dice[0].results).sort((a,b)=>a.result-b.result);
		let rollResult = parseInt(roll.result,10);
		let result = rollResult>threshold;
		let successRange = rollResult - threshold;
		let dice = [];
		let successQuality = "";
		
		let d1 = parseInt(rollDice[0].result, 10);
		let d2 = parseInt(rollDice[1].result, 10);
		let d3 = parseInt(rollDice[2].result, 10);
		dice.push({
			value: ""+d1,
			class: `${d1>threshold?"resolve-action-roll-success":"resolve-action-roll-failed"}${d1!=d2?" resolve-action-roll-discarded":""}`
		});
		dice.push({
			value: ""+d2,
			class: `${d2>threshold?"resolve-action-roll-success":"resolve-action-roll-failed"}`
		});
		dice.push({
			value: ""+d3,
			class: `${d3>threshold?"resolve-action-roll-success":"resolve-action-roll-failed"}${d3!=d2?" resolve-action-roll-discarded":""}`
		});
		if(result) {
			if(d1==d2 && d2==d3)
				successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultGreaterSuccess");
			else if(d1==d2 || d2==d3)
				successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultLowerSuccess");
			else
				successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultNormalSuccess");
		} else {
			if(d1==d2 && d2==d3)
				successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultGreaterFailure");
			else if(d1==d2 || d2==d3)
				successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultLowerFailure");
			else
				successQuality = game.i18n.localize("SYSFEERIE.Chat.DiceResultNormalFailure");
		}

		return {
			Action: action,
			Difficulty: difficulty,
			Score: score,
			Threshold : threshold,
			Result: result,

			HasRoll: true,
			Roll: roll,
			Dice: dice,
			SuccessBased:false,
			DoubleBased:true,
			RollResult: rollResult,
			AutoSuccess: false,
			AutoFailure: false,

			HasRollRange: true,
			SuccessRange: successRange,
			SuccessQuality: successQuality,

			ClassActionResult: result? "resolve-action-success" : "resolve-action-failed",
			TextActionResult: result? `<i class="fas fa-check"></i> ${game.i18n.localize("SYSFEERIE.Chat.ResultSuccess")}` : `<i class="fas fa-times"></i> ${game.i18n.localize("SYSFEERIE.Chat.ResultFailed")}`,
		};
	}

}