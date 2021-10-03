# SystemeFeerie-FoundryVTT

![Couverture](media/cover.jpg)

Ce système est conçu pour jour aux jeux utilisant le [*Système Féerie*](https://systeme.feerie.net) avec [*Foundry Virtual Tabletop*](https://foundryvtt.com/).
Le *Système Féerie* est un système de simulation générique descriptif qui favorise la description aux mécaniques habituelles de la plupart des jeux de rôle, que ce soit au niveau de la création des personnages que du système de résolution des actions.

Première particularité, ce système utilise un processus atypique pour la création des personnages : le personnage est initialement défini avec des termes courants, à partir d’un questionnaire ou en rédigeant une description du personnage ; puis les règles transposent simplement et naturellement les éléments de ce personnage en caractéristiques chiffrées qui seront utilisées lors de la résolution des actions. Il n’y a pas de système de points/classe/niveau/archétype pour “encadrer” ou restreindre cette création et dans l’absolu, cette méthode permet de créer n’importe quel personnage de n’importe quel univers.

Dans cette optique descriptive, les règles ne décrivent que des mécaniques de résolution mais sans imposer des règles pour fixer les conséquences (par exemple, il n’y a pas de gestion précise de la santé). Dans l’optique du *Système Féerie*, ce n’est pas au système de jeu de déterminer précisément comment l’action doit se comporter, mais aux participants. Par ailleurs, les règles de résolution ne font aucune distinction sur la nature des actions à résoudre : pas de spécificité pour, par exemple, le combat.

Le *Système Féerie* met une partie du pouvoir narratif entre les mains des joueurs qui leur permettent d’influencer directement la trame scénaristique. Par exemple, ils peuvent décrire eux même, sous certaines conditions, le résultat des actions de leur personnage, ou encore modifier, lier ou introduire des éléments scénaristiques. Et ceci grâce aux points de personnage.

Ce système a été conçu pour être simple et rapide à prendre en main. Comme il a été principalement développé pour Solaires, il se destine principalement aux jeux d’aventures.

## Informations techniques

TODO

## Installation

TODO

## Screenshots

TODO

## Créer un personnage

Le *Système Féerie* est un système de jeu particulier qui part de la description des personnages pour le construire mécaniquement.

Concrètement, après avoir créé un nouvel acteur, vous vous retrouverez avec la fiche vièrge prête à remplir.

![La fiche de personnage vide, avec seulement le nom du personnage rempli](media/fiche_vide.jpg)

La première étape pour la remplir consiste à choisir les rôles du personnage (une sorte de contrat qui sert à les répartir entre les différents personnages du groupe, histoire). La liste des rôles dépend du jeu joué et des aspects qui seront mis en avant.

La seconde étape consiste à écrire un court concept qui répond à ces rôles pour servir de point de départ à la création du personnage. C'est une phrase courte par exemple : "Un magicien elfe, consultant pour les forces de l'ordre de la ville".

Enfin vient la description, remplissez là en cliquant sur le crayon et définissez plus précisément votre personnage en développant votre concept.

![La fiche de personnage avec les rôles, concept et description de remplies](media/fiche_description.jpg)

Ceci fait, vous allez extraire les éléments. Il s'agit des mots clés définissant votre personnage auquel vous allez associer un score. Ce sont ces éléments qui seront utilisés lors des jets de dés pour les actions.

Pour extraire un élément, cliquez sur la pièce de puzzle au dessus de la description et vous aurez la fenêtre de sélection de la source d'un élément. Cliquez sur les mots de l'expression que vous souhaitez transformer en élément pour les sélectionner.

![La fenêtre d'extration d'un élément avec l'expression «un elfe» sélectionnée.](media/fiche_extraction.jpg)

Une fois satisfait, cliquez sur « Ok » et la fenêtre de l'élément s'ouvrira. Dedans, vous pouvez modifier le nom de l'élément (Par exemple, « Consultant en magie » est plus clair que « travaillant pour les forces de l'ordre sur les affaires de magie »). Choisissez une catégorie pour l'élément et évaluez sa valeur en fonction de ce que l'élément représente. Si vous souhaitez modifier la source (ce texte correspondant à l'élement dans la description), vous pouvez cliquer sur la pièce de puzzle en bas. Si vous le souhaitez, vous pouvez choisir une autre icone en cliquant dessus.

![La fenêtre de configuration de l'élément Elfe.](media/fiche_element.jpg)

Une fois l'élément extrait et configuré, vous verrez son expression mise en gras avec son score directement dans la description. Vous le trouverez aussi dans l'onglet *Éléments* de la fiche.

![La fiche de personnage avec les rôles, concept et description de remplies](media/fiche_description_extrait.jpg)

Recommencez pour extraire tous les éléments. Vous pouvez aussi changer le portrait de votre personnage en cliquant dessus. Si le meneur le souhaite, vous pouvez modifier le montant des points de personnage en cliquant dessus (bouton gauche pour diminuer, bouton droit pour l'augmenter).

Voila, le personnage est prêt !

![La fiche de personnage d'Alvin, remplie](media/fiche_remplie.jpg)

## Faire une action

Lorsqu'un personnage va effectuer une action qui a des chances de rater (ou de réussir), le meneur peut demander un jet de résolution.

Pour commencer une action, le meneur peut utiliser la *Start Action* qui est à sa disposition dans le compendium *Macros*. Ceci lui ouvrira la fenêtre *Débuter une action*.

![La fenêtre début d'une action](media/action_debut.jpg)

Sur cette fenêtre, le meneur peut choisir la difficulté intrinsèque (à quel point l'action est difficile dans l'univers du jeu) et l'intérêt scénaristiques (est-ce que la réussite ou l'échèque donnerait un résultat plus intéressant que l'autre ?). Une fois son choix validé, il peut cliquer sur *Commencer l'action*. Une boîte va alors apparaître dans le chat.

![La fenêtre d'action dans le chat](media/action_chat_vide.jpg)

Le joueur peut alors choisir un élément sur sa fiche, en cliquant sur son nom depuis sa description ou dans la listes des Éléments et des États. L'élément sélectionné apparaîtra dans la boîte du chat. Si cet élément est typique (par exemple une carrière *Secouriste* serait typique pour une action qui consterait à faire les premiers soins), le meneur peut autoriser un second élément. Pour enlever un élément de l'action, il suffit de cliquer sur la petite croix à droite. (Note : les éléments peuvent provenir de personnages différents)

![La fenêtre d'action dans le chat, un joueur a choisi un élément "Magicien"](media/action_chat_element.jpg)

Une fois que le meneur à validé les éléments, il peit cliquer sur le bouton *MJ* et le joueur peut cliquer sur Lancer les dés. Les dés sont alors lancés et le résultat s'affiche !

![La fenêtre d'action dans le chat une fois résolue. Et c'est une réussite !](media/action_resolue.jpg)

## Remerciements et contributions

Un grand merci à JDW pour le travail qu'il a réalisé sur le système pour Solaires dont certains éléments ont été repris ici (en particulier, la résolution des actions).

## Licences

* Le code du module est distribué sous la licence [GPL-3](https://www.gnu.org/licenses/gpl-3.0.en.html)
* Le contenu des compendiums est distribué sous la licence [Creative Commons CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
