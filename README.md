# RPG-Maker-MV-Plugin---Systeme-jour-nuit

1. English
2. Français

----------  English ----------

Hello everyone !

This is my very first plugin for RPG Maker MV.

At the moment, I've only been learning JavaScript for 2 months, so if you see any errors, don't hesitate to tell me so that I can correct them.
This plugin is a first draft. It is not finished but already functional as it is.

Terms of use :
- It can be used for commercial and non commercial games.
- Just add my name in your game/project credits.
- Please, link back to this link https://forums.rpgmakerweb.com/index.php?threads/revahar-plugin-journuit-day-night-rpgmmv.158267/  
if you want to share it.
(You can send me en message if you need help, at revahar@hotmail.com)

--------------------------------------------------------
Plugin: Day/night system with screen tint management.
--------------------------------------------------------

This plugin uses 4 game variables that you can set in the plugin settings.
These 4 variables will contain the start time of each phase of the day (morning, day, evening, night).
You can therefore define the ID of the variable to use as well as its content (6, 8, 19, 21).
In this way, the morning will start at 6 a.m., the day at 8 a.m., the evening at 7 p.m. and the night at 9 p.m.

This plugin uses a counting system based on the number of frames (X frames = 1 seconds. 60 seconds = 1 minutes. Etc.)
By default, this value is 5 but can be changed in plugin settings.

The transition between each phase is done dynamically. By default, the hue transition is done in 600 frames (10 seconds).
This value can be changed in the plugin settings.

4 switches are used in this plugin, each switch corresponds to a phase.
You can thus define the appearance of an event according to the active switch.
By default, switches 1, 2, 3 and 4 are used but you can change the IDs in the settings.

If you want the time to scroll but the hue change is no longer activated, then you can use the command
DisableTint plugin in a parallel event.

To enable or re-enable tints, use the plugin command EnableTint.
/!\ Each Map where you want the day/night system to be active must contain an EnableTint.

To have the tint update instantly when exiting a location where tint management was
disabled, use the plugin command EnableTintOnExit.
/!\ To put in the event of the exit door of the building just before or after the teleportation.

To define the tint of dungeons/caves and other places without light (tint value editable on line 239)
use the DungeonTint plugin command.
/!\ To put in a parallel event.

To enable or re-enable tints, use the plugin command EnableTint.
/!\ Each Map where you want the day/night system to be active must contain an EnableTint.

To have the tint update instantly when exiting a location where tint management was
disabled, use the plugin command EnableTintOnExit.
/!\ To put in the event of the exit door of the building just before or after the teleportation.

To define the tint of dungeons/caves and other places without light (tint value editable on line 239)
use the DungeonTint plugin command.
/!\ To put in a parallel event.


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


---------- Français ----------

Bonjour à toutes et à tous !

Voici mon tout premier plugin pour RPG Maker MV.
À l'heure actuelle, ça ne fait que 2 mois que j'apprend le JavaScript donc si vous voyez des erreurs surtout n'hésitez pas à me le dire pour que je puisse corriger.
Ce plugin est un premier jet. Il n'est pas terminé mais déjà fonctonnel en l'état.

Conditions d'utilisation :
- Il peut être utilisé pour des jeux commerciaux et non commerciaux.
- Ajoutez simplement mon nom dans les crédits de votre jeu/projet.
- S'il vous plaît, créez un lien vers le git ou ce lien https://forums.rpgmakerweb.com/index.php?threads/revahar-plugin-journuit-day-night-rpgmmv.158267/ 
si vous souhaitez le partager.
(Tu peux m'envoyer un message si tu as besoin d'aide à l'adresse revahar@hotmail.com)

----------------------------------------------------------------
Plugin : Système jour/nuit avec gestion de la teinte de l'écran.
----------------------------------------------------------------

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

test github