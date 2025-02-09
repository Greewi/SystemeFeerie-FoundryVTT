export default {
	"id": "chimere",
	"name": "Chimère, Série 2",
	"systemVersion": 6,
	"lang": "fr",
	"rolls" : {
		"maxElementNumber": 2,
		"scoreMethod":"SECOND_HALVED_BY_RELEVANCE",
		"qualityMethod":"QUALITY_FROM_DOUBLE"
	},
	"difficulties": [
		{"score":2,"name":"Simple", "description":"Même une incompétente devrait s'en sortir. Une chimère, même incompétente, était déjà suffisante."},
		{"score":4,"name":"Ardue", "description":"Vaut mieux avoir les bases. Deux chimères incompétentes devraient y arriver."},
		{"score":6,"name":"Complexe", "description":"Peut mettre une apprentie en difficulté. Trois chimères ne seront vraiment pas de trop pour avoir une chance raisonnable d’y arriver."},
		{"score":8,"name":"Démentielle", "description":"Peut mettre une spécialiste en difficulté. Quatre ou cinq  chimères compétentes pour avoir une chance raisonnable d’y arriver."},
		{"score":10,"name":"Insensée", "description":"Même les meilleures n'ont que peu de chance d'y parvenir. Même 5 chimères compétentes ont de bonnes chances de s’y casser les dents."}
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
			"id":"QUALITY",
			"name":"Qualité",
			"icon":"icons/magic/control/buff-strength-muscle-damage-orange.webp",
			"short":"Q",
			"description":"Représentent des qualités du personnages, des particularités physiques ou mentales qui peuvent donner à la chimère un avantage dans certaines situations.",
			"levels": [
				"Insignifiante : invisible et n'aide en rien.",
				"Légère : pourrait passer inaperçue et n'aide presque pas.",
				"Significative : peut apporter un avantage significatif lors de certaines actions.",
				"Importante : difficile à rater et peut apporter un très grand avantage lors de certaines actions.",
				"Ultime : une qualité qui peut trivialiser certaines situations."
			]
		},{
			"id":"SKILLS",
			"name":"Compétence",
			"icon":"icons/commodities/treasure/medal-ribbon-star-gold-red.webp",
			"short":"C",
			"description":"Représentent les compétences particulières que la chimère à acquise.",
			"levels": [
				"Incompétente : la chimère n'a aucune idée de quoi il s'agit.",
				"Débutante : la chimère commence à peine à s'intéresser à cette compétence.",
				"Amateure : la chimère a encore une maîtrise très relative de la compétence.",
				"Professionnelle : la chimère est capablue d'utiliser cette compétence avec fiabilité.",
				"Experte : la chimère maîtrise parfaitement la compétence."
			]
		},{
			"id":"DISCIPLINE",
			"name":"Discipline",
			"icon":"icons/skills/social/diplomacy-peace-alliance.webp",
			"short":"D",
			"description":"Représentent des champs de connaissances théoriques et pratiques qui permettent à la chimère de développer le camp et de conduire des projets.",
			"levels": [
				"Incompétente : ne connaît que ce que les connaissances générales lui donnent.",
				"Débutante : ne possède quelques concepts de base.",
				"Amateure : connaît tous les concepts de base et quelques concepts avancés.",
				"Professionnelle : connaît la plupart des concepts avancés.",
				"Experte : connaît le champ de façon extensive."
			]
		},{
			"id":"EQUIPMENT",
			"name":"Équipement",
			"icon":"icons/tools/smithing/hammer-maul-steel-grey.webp",
			"short":"E",
			"description":"Représentent les outils, armes et autre matériel à disposition. On ne note dans l'inventaire d'une colonie que ceux qu'elles ne peuvent pas produire facilement.",
			"levels": [
				"Improvisé : une branche, une pierre ou tout autre truc trouvé dans la nature qui n'a pas été conçu pour réaliser quelque chose.",
				"Primitif : un objet de facture primitive ou utilisant des technologies primitives.",
				"Artisanal : un objet produit selon des méthodes artisanales.",
				"Moderne : un objet conçu et fabriqué avec des moyens modernes.",
				"Futuriste : un artefact issu d'une technologie futuriste."
			]
		},{
			"id":"MODIFICATION",
			"name":"Modification",
			"icon":"icons/commodities/biological/foot-amphibian-green.webp",
			"short":"M",
			"description":"Représentent les modifications nanotechnologiques dont la chimère dispose.",
			"levels": [
				"Nulle : pas de modification",
				"Économique : une modification consommant peu de bioénergie.",
				"Gourmande : une modification consommant beaucoup de bioénergie.",
				"Maximale : une modification consommant pratiquement toute la bioénergie disponible.",
				"Excessive : une modification qui ne peut pas être installée sur une chimère."
			]
		},{
			"id":"INSTALLATION",
			"name":"Installation",
			"icon":"icons/environment/settlement/well.webp",
			"short":"I",
			"description":"Représentent les constructions, ateliers et habitations de la Colonie.",
			"levels": [
				"Nulle : inexistante.",
				"Primitif  : une installation conçue avec des technologies primitives.",
				"Artisanal  : une installation construite selon des méthodes artisanales.",
				"Moderne  : une installation conçue et construite avec des moyens modernes.",
				"Futuriste  : une installation issue d'une technologie futuriste."
			]
		},{
			"id":"RESSOURCE",
			"name":"Ressource",
			"icon":"icons/skills/trades/woodcutting-logging-axe-stump.webp",
			"short":"R",
			"description":"Représentent les sources de matériaux proche de la Colonie (accessible en moins d'une journée).",
			"levels": [
				"Nulle : inexistante.",
				"Rare : la ressource demande jusqu'à un jour de travail pour être extraite ou rapportée au Colonie et se limite à ce que peut transporter une seule chimère.",
				"Accessible : la ressource est proche de la Colonie et demande un peu de travail pour être récupérée.",
				"Abondante : la ressource est accessible dans la Colonie et couvre complètement les besoins.",
				"Illimitée : la ressource est directement accessible là où elle est nécessaire et en plus grande quantité que les besoins."
			]
		},{
			"id":"MATERIAUX",
			"name":"Matériaux",
			"icon":"icons/commodities/materials/bowl-powder-teal.webp",
			"short":"M",
			"description":"Représentent des matériaux stockés dans les réserves de la Colonie. On ne note que ceux que la colonie ne peut pas produire facilement.",
			"levels": [
				"Nul : inexistant.",
				"Rares : la Colonie ne possède qu'une très petite quantité de ce matériau, juste assez pour quelques outils.",
				"Limités : la Colonie ne possède le nécessaire que pour tout au plus un seul petit projet.",
				"Abondants : les chimères disposent d'assez de ce matériau pour réaliser plusieurs petit projets ou un grand projet.",
				"Illimités : les réserves de ce matériaux seront suffisantes pour plusieurs grands projets."
			]
		}
	]
}