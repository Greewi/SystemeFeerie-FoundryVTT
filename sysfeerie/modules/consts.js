export default class Consts {
	// Element score aggregation
	static SCORE_SUM = "SUM";
	static SCORE_DEGRESSIVE_SUM = "DEGRESSIVE_SUM";
	static SCORE_MAX_PLUS_COUNT = "MAX_PLUS_COUNT";
	static SCORE_SECOND_HALVED_BY_RELEVANCE = "SECOND_HALVED_BY_RELEVANCE";
	static SCORE_RELEVANCE_PLUS_COUNT = "SCORE_RELEVANCE_PLUS_COUNT";

	// Relevance of an element regardig to an action
	static RELEVANCE_CONNEXE = "CONNEXE";
	static RELEVANCE_TYPICAL = "TYPICAL";
	static RELEVANCE_SPECIFIC = "SPECIFIC";

	// Quality calculation methods
	static QUALITY_FROM_MARGIN = "QUALITY_FROM_MARGIN";
	static QUALITY_FROM_DOUBLE = "QUALITY_FROM_DOUBLE";

	// Icon for action difficulties
	static DIFFICULTIES_ICONS = [
		"fas fa-cookie-bite",
		"fas fa-grin-beam-sweat",
		"fas fa-hard-hat",
		"fas fa-fire-alt",
		"fas fa-pray"
	];

	// Icon for action significances
	static SIGNIFICANCES_ICONS = [
		"fas fa-check-double",
		"fas fa-check",
		"fas fa-grip-lines",
		"fas fa-times",
		"fas fa-skull-crossbones"
	];
}