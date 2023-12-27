export default {
	"id": "default",
	"name": "Défaut",
	"systemVersion": 5,
	"lang": "fr",
	"rolls" : {
		"maxElementNumber": 2,
		"scoreMethod":"SUM"
	},
	"difficulties": [
		{"score":4,"name":"Simple", "description":"Tout le monde a de grandes chances de réussir."},
		{"score":2,"name":"Ardue", "description":"Mieux vaut s’y connaître un minimum."},
		{"score":0,"name":"Complexe", "description":"Quelqu’un de bon a toutes ses chances."},
		{"score":-2,"name":"Démentielle", "description":"Seul un spécialiste très bon s’y frotterait."},
		{"score":-4,"name":"Insensée", "description":"Seul quelqu’un de désespéré essaierait."}
	],
	"signifiances": [
		{"score":4,"name":"Devrait réussir", "description":"L’échec de l’action engendrerait une situation indésirable."},
		{"score":2,"name":"Réussite intéressante", "description":"La réussite de cette action conduira à une situation plus intéressante que l’échec."},
		{"score":0,"name":"Neutre", "description":"La réussite et l’échec sont aussi (in)intéressants l’un que l’autre."},
		{"score":-2,"name":"Échec intéressant", "description":"L’échec de cette action conduira à une situation plus intéressante que sa réussite."},
		{"score":-4,"name":"Devrait échouer", "description":"La réussite de cette action engendrerait une situation indésirable."}
	],
	"categories": [
		{
			"id":"FEATURE",
			"name":"Trait",
			"icon":"icons/magic/control/buff-strength-muscle-damage-orange.webp",
			"short":"T",
			"description":"Réprésente les points particuliers du personnage, physiques comme mentaux.",
			"levels": [
				"Insignifiant : une particularité qui n’a aucun impact pour le personnage et ses actions.",
				"Léger : une particularité qui ne se remarque pas nécessairement et qui n’a pas un impact majeur sur la vie du personnage.",
				"Important : une particularité qui est difficile à manquer mais qui ne conditionne pas pour autant la vie du personnage.",
				"Extrême : une particularité tellement importante que la vie du personnage gravite autour d’elle."
			]
		},{
			"id":"PERSONALITY",
			"name":"Trait de personnalité",
			"icon":"icons/creatures/eyes/human-single-blue.webp",
			"short":"P",
			"description":"Réprésente les traits de caractère, les motivations, les opinions et les croyances du personnage.",
			"levels": [
				"Insignifiant : un trait de personnalité qui n’a aucun impact sur les décisions ou le comportement du personnage.",
				"Mineur : le personnage peut ignorer ce trait de personnalité sans grand effort.",
				"Important : un trait de personnalité que le personnage a beaucoup de mal à ignorer et qui intervient dans de nombreuses situations.",
				"Impérieux : le personnage interprète toutes les situations au travers ce trait de personnalité. Nous déconseillons fortement des traits de personnalité à ce niveau car ils restreignent trop fortement les choix du joueur."
			]
		},{
			"id":"CAREER",
			"name":"Carrière",
			"icon":"icons/skills/social/diplomacy-peace-alliance.webp",
			"short":"C",
			"description":"Représente les métiers, formations, loisirs et autres occupations du personnage. En cours de jeu, n’oubliez pas que celles-ci incluent aussi des relations anonymes, par exemple des collègues, des fournisseurs, des employeurs, etc.",
			"levels": [
				"Profane : le personnage n’a jamais pratiqué ou étudié cette carrière.",
				"Débutant : le personnage débute, étudie ou est un apprenti.",
				"Professionnel : le personnage exerce le métier professionnellement ou est un amateur très investi.",
				"Expert : le personnage est un spécialiste respecté, un maître et cette carrière est une véritable vocation pour le personnage."
			]
		},{
			"id":"NETWORK",
			"name":"Relation",
			"icon":"icons/skills/social/diplomacy-handshake.webp",
			"short":"R",
			"description":"Représente les contacts, les alliés et autres liens sociaux du personnage. Il peut s’agit d’individus ou d’organisation. Dans ce dernier cas, nous ne faisons pas de distinction pour le score que l’on considère l’organisation elle-même ou les individus la composant.",
			"levels": [
				"Connu : le personnage peut est connu de l’entité, mais elle n’a pas de raison de lui accorder quoi que ce soit.",
				"Favorable : l’entité accepte de fournir des faveurs au personnage tant que ça ne lui coûte rien.",
				"Allié : l’entité accepte d’aider le personnage même si cela représente un coût significatif, tant qu’elle ne court pas elle-même un risque significatif.",
				"Dévoué : l’entité est prête à s’engager complètement pour le personnage."
			]
		},{
			"id":"EQUIPMENT",
			"name":"Équipement",
			"icon":"icons/tools/smithing/hammer-maul-steel-grey.webp",
			"short":"E",
			"description":"Représente le matériel usuel du personnage.",
			"levels": [
				"Ordinaire : le matériel standard, qu’il soit spécialisé ou non.",
				"Spécial : le matériel amélioré, modifié ou personnalisé que possèdent les spécialistes.",
				"À la pointe de la technologie : le matériel à la pointe de la technologie, ce qui se fait de mieux.",
				"Prochaine génération : le matériel expérimental destiné à remplacer le matériel actuel lorsqu’il sera finalisé. On trouve principalement des prototypes ou les outils de certains technophiles les plus investis."
			]
		}
	]
}