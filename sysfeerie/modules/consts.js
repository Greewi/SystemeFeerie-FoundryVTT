export default class Consts {
	// Element score aggregation
	static SCORE_SUM = "SUM";
	static SCORE_SUM_PLUS_BONUS ="SUM_PLUS_BONUS";
	static SCORE_DEGRESSIVE_SUM = "DEGRESSIVE_SUM";
	static SCORE_MAX_PLUS_COUNT = "MAX_PLUS_COUNT";

	// Quality calculation methods
	static QUALITY_FROM_DOUBLE = "QUALITY_FROM_DOUBLE";

	// Icon for action difficulties
	static DIFFICULTIES_ICONS = [
		"fas fa-cookie-bite",
		"fas fa-grin-beam-sweat",
		"fas fa-hard-hat",
		"fas fa-fire-alt",
		"fas fa-pray"
	];

	// Icon for action difficulty mods
	static DIFFICULTY_MODS_ICONS = [
		"fas fa-check-double",
		"fas fa-check",
		"fas fa-grip-lines",
		"fas fa-times",
		"fas fa-skull-crossbones"
	];
}