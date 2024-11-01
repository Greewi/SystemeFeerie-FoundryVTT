export default {
	"id": "cde",
	"name": "Contes de l'Entremondes",
	"systemVersion": 6,
	"lang": "fr",
	"rolls" : {
		"maxElementNumber": 3,
		"scoreMethod":"DEGRESSIVE_SUM",
		"qualityMethod":"QUALITY_FROM_MARGIN"
	},
	"difficulties": [
		{"score":0,"name":"Trivial", "description":"Réussite automatique. Créer un effet imperceptible qui n'altère en rien le monde. Utiliser un art dans son propre domaine ou pour un effet qui n'altère pas l'extérieur de la fée."},
		{"score":2,"name":"Simple", "description":"Même les plus mauvais devraient s'en sortir. Créer un effet que les habitants ne peuvent pas distinguer des lois naturelles du monde, ou aucun témoin. Utiliser un art dans un domaine d'une fée alliée ou de sa cour."},
		{"score":4,"name":"Ardue", "description":"Vaut mieux avoir les bases. Créer un effet très simple à rationnaliser observé par quelques témoins. Utiliser un art dans un domaine neutre ou hors d'un domaine."},
		{"score":6,"name":"Complexe", "description":"Peut mettre un apprenti en difficulté. Créer un effet rationnalisable avec un effort modéré avec au plus quelques témoins. Utiliser un art dans le domaine d'une fée méfiante ou hostile."},
		{"score":8,"name":"Démentielle", "description":"Peut mettre un spécialiste en difficulté. Créer un effet difficile à rationnaliser avec quelques habitants témoins, ou effet rationnalisable avec un efforts modéré vu par une foule. Utiliser un art pour altérer temporairement le domaine d'une autre fée."},
		{"score":10,"name":"Insensée", "description":"Même les meilleurs n'ont que peu de chance d'y parvenir. Créer un effet difficile à rationnaliser vu par une foule. Utiliser un art pour altérer une autre fée dans son domaine."},
		{"score":12,"name":"Impossible", "description":"Échec automatique. Créer un effet visible pour des milliers de témoins, ou un effet impossible à rationnaliser. Utiliser un art dans l'Irréel ou pour altérer de façon permanente le domaine d'une autre fée."}
	],
	"signifiances": [
		{"score":-4,"name":"Devrait réussir", "description":"L’échec de l’action engendrerait une situation indésirable."},
		{"score":-2,"name":"Réussite intéressante", "description":"La réussite de cette action conduira à une situation plus intéressante que l’échec."},
		{"score":0,"name":"Neutre", "description":"La réussite et l’échec sont aussi (in)intéressants l’un que l’autre."},
		{"score":2,"name":"Échec intéressant", "description":"L’échec de cette action conduira à une situation plus intéressante que sa réussite."},
		{"score":4,"name":"Devrait échouer", "description":"La réussite de cette action engendrerait une situation indésirable."}
	],
	"ratings": [
		{"score":1,"name":"Incompétent", "description":"N'y connait rien ou presque."},
		{"score":2,"name":"Débutant", "description":"N'a pas encore vraiment les bases."},
		{"score":3,"name":"Apprenti", "description":"Possède les bases mais pas plus."},
		{"score":4,"name":"Professionnel", "description":"Apte à en faire son métier."},
		{"score":5,"name":"Spécialiste", "description":"Très bon dans le domaine."},
		{"score":6,"name":"Grand maître", "description":"L'un des meilleurs dans le domaine."}
	],
	"categories": [
		{
			"id":"FEATURE",
			"name":"Trait",
			"icon":"icons/creatures/magical/fae-fairy-winged-glowing-green.webp",
			"short":"T",
			"description":"Réprésente les points particuliers du personnage, physiques comme mentaux.",
			"levels": [
				"Insignifiant : sans importance et ne se remarque pas.",
				"Léger : ne se remarque généralement pas et n’affecte que très légèrement le personnage.",
				"Significatif : se remarque facilement et affecte significativement le personnage.",
				"Important : immanquable et affecte profondément le personnage.",
				"Extrême : la vie du personnage est conditionnée par ce trait."
			]
		},{
			"id":"VOCATION",
			"name":"Vocation",
			"icon":"icons/magic/nature/plant-sproud-hands-dirt-green.webp",
			"short":"V",
			"description":"Représente un domaine d'activé ou des intérêts de la fée.",
			"levels": [
				"Incompétent : aucune connaissance ou pratique.",
				"Débutant : découvre la vocation.",
				"Apprenti : apprend les tenants et aboutissant de la vocation, étudiante.",
				"Professionnel : apte à en faire son métier.",
				"Maître : l’une des meilleures de sa génération."
			]
		},{
			"id":"NETWORK",
			"name":"Relation",
			"icon":"icons/skills/social/diplomacy-handshake.webp",
			"short":"R",
			"description":"Représente les contacts, les alliés et autres liens sociaux du personnage. Il peut s’agit d’individus ou d’organisation. Dans ce dernier cas, nous ne faisons pas de distinction pour le score que l’on considère l’organisation elle-même ou les individus la composant.",
			"levels": [
				"Neutre : la relation n’a aucune raison d’accorder des faveurs au personnage.",
				"Ouverte : la relation n’acceptera d’aider le personnage que si ça lui rapporte.",
				"Favorable : la relation aidera le personnage tant que ça ne lui coûte rien.",
				"Allié : la relation aidera le personnage tant que ça ne la met pas en péril.",
				"Dévoué : la relation est prête à se mettre en péril pour le personnage."
			]
		},{
			"id":"ECHO",
			"name":"Écho",
			"icon":"icons/environment/wilderness/tree-oak.webp",
			"short":"E",
			"description":"Représente un écho, une parcelle du domaine de la fée",
			"levels": [
				"Banal : un lieu banal pour lequel les habitants n'ont pas vraiment d'affect.",
				"Particulier: un lieu qui sort de l'ordinaire et que ses habitants tiennent pour particulier.",
				"Singulier : un lieu singulier que les habitants considèrent avec une émotion particulière.",
				"Extraordinaire : un lieu extraordinaire pour lequel les habitants ont des sentiments très prononcés.",
				"Incroyable : un lieu avec un aspect incroyable que les habitants vénèrent ou craigne plus que tout."
			]
		}
	]
}