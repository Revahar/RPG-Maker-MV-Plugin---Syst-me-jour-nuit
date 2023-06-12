# RPG-Maker-MV-Plugin---Syst-me-jour-nuit
Système jour/nuit avec gestion des teintes de l'écran.

Bonjour à toutes et à tous !

Voici mon tout premier plugin pour RPG Maker MV.
À l'heure actuelle, ça ne fait que 2 mois que j'apprend le JavaScript donc si vous voyez des erreurs surtout n'hésitez pas à me le dire pour que je puisse corriger.
Ce plugin est un premier jet. Il n'est pas terminé mais déjà fonctonnel en l'état.

Plugin : Système jour/nuit avec gestion des teintes de l'écran.

Ce plugin utilise 4 variables du jeu que vous pouvez définir dans les paramètres du plugin. 
Ces 4 variables vont contenir  l'heure du début de chaque phase de la journée (matin, journée, soir, nuit).
Vous pouvez donc définir l'ID de la variable à utiliser ainsi que son contenu (6, 8, 19, 21).
De cette manière, le matin commencera à 6h, la journée à 8h, le soir à 19h et la nuit à 21h.

Ce plugin utilise un système de comptage basé sur le nombre de frames (X frames = 1 secondes. 60 secondes = 1 minutes. Etc.)
Par défaut, cette valeur à est 5 mais peut être modifiée dans les paramètres du plugin.

La transition entre chaque phase se fait de manière dynamique. Par défaut, la transition de teinte se fait en 600 frames (10 secondes).
Cette valeur peut être modifiée dans les paramètres du plugin.

4 switches sont utilisés dans ce plugin, chaque switch correspond à une phase. 
Vous pouvez ainsi définir l'apparition d'un évenement en fonction du switch actif.
Par défaut, se sont les switch 1, 2, 3 et 4 qui sont utilisés mais vous pouvez modifier les IDs dans les paramètres.

Si vous souhaitez que le temps défile mais que le changement de teinte ne soit plus activé, alors vous pouvez utiliser la commande 
de plugin DisableTint dans un évènement parallèle.

Pour activer ou réactiver les teintes, utilisez la commande de plugin EnableTint.
/!\ Chaque Map où vous souhaitez que le système jour/nuit soit actif doit contenir un EnableTint.

Pour que la teinte se mette à jour instantanément lors de la sortie d'un lieu où la gestion des teintes était 
désactivée, utilisez la commande de plugin EnableTintOnExit.
/!\ À mettre dans l'évènement de la porte de sortie du bâtiment juste avant ou après la téléportation.

Pour définir la teinte des donjons/grottes et autres lieux sans lumière (valeur de la teinte modifiable à la ligne 239) 
utilisez la commande de plugin DungeonTint. 
/!\ À mettre dans un évènement parallèle.
