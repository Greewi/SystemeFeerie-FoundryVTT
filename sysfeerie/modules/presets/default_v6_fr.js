export default {
	"id": "default",
	"name": "Défaut",
	"systemVersion": 6,
	"lang": "fr",
	"rolls" : {
		"maxElementNumber": 2,
		"scoreMethod":"SECOND_HALVED_BY_RELEVANCE",
		"qualityMethod":"QUALITY_FROM_MARGIN"
	},
	"difficulties": [
		{"score":2,"name":"Simple", "description":"Même les plus mauvais devraient s'en sortir."},
		{"score":4,"name":"Ardue", "description":"Vaut mieux avoir les bases."},
		{"score":6,"name":"Complexe", "description":"Peut mettre un apprenti en difficulté."},
		{"score":8,"name":"Démentielle", "description":"Peut mettre un spécialiste en difficulté."},
		{"score":10,"name":"Insensée", "description":"Même les meilleurs n'ont que peu de chance d'y parvenir."}
	],
	"significances": [
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
			"icon":"icons/magic/control/buff-strength-muscle-damage-orange.webp",
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
			"id":"CAREER",
			"name":"Carrière",
			"icon":"icons/skills/social/diplomacy-peace-alliance.webp",
			"short":"C",
			"description":"Représente les métiers, formations, loisirs et autres occupations du personnage. En cours de jeu, n’oubliez pas que celles-ci incluent aussi des relations anonymes, par exemple des collègues, des fournisseurs, des employeurs, etc.",
			"levels": [
				"Incompétent : aucune connaissance ou pratique.",
				"Débutant : découvre le métier.",
				"Apprenti : apprend le métier, étudiant.",
				"Professionnel : apte à en faire son métier.",
				"Maître : l’un des meilleurs de sa génération."
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
			"id":"EQUIPMENT",
			"name":"Équipement",
			"icon":"icons/tools/smithing/hammer-maul-steel-grey.webp",
			"short":"E",
			"description":"Représente le matériel usuel du personnage.",
			"levels": [
				"Banal : un objet courant dont la qualité et l’efficacité n’ont pas vraiment d’importance.",
				"Gadget : un objet à l’efficacité très discutable que n’importe qui peut avoir et que beaucoup ont.",
				"Entrée de gamme : du matériel de mauvaise qualité ou limité dans ses capacités et simple d’accès.",
				"De pro : du matériel de bonne qualité et complètement fonctionnel, généralement réservé aux professionnels.",
				"État de l’art : du matériel à la pointe de la technologie, le meilleur possible mais aussi le plus difficile à se procurer."
			]
		}
	]
}