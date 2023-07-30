//=============================================================================
// Revahar - Plugin JourNuit RPGMMV
//=============================================================================
/*:
 * @plugindesc Plugin de système jour/nuit pour RPG Maker MV. test de fonctionnement
 * Version 1.1
 * @author Revahar
 *
 * @param Variable Matin
 * @desc La variable contenant l'heure du début du matin
 * @default 1
 *
 * @param Variable Journee
 * @desc La variable contenant l'heure du début de la journée
 * @default 2
 * 
 * @param Variable Soir
 * @desc La variable contenant l'heure du début du soir
 * @default 3
 *
 * @param Variable Nuit
 * @desc La variable contenant l'heure du début de la nuit
 * @default 4
 *
 * @param Matin Heure
 * @desc L'heure à laquelle la phase du matin commence.
 * @default 6
 *
 * @param Journee Heure
 * @desc L'heure à laquelle la phase de la journée commence.
 * @default 8
 *
 * @param Soir Heure
 * @desc L'heure à laquelle la phase du soir commence.
 * @default 19
 *
 * @param Nuit Heure
 * @desc L'heure à laquelle la phase de la nuit commence.
 * @default 21
 *
 * @param Frames par seconde
 * @desc Le nombre de frames nécessaire pour faire une seconde (60 frames = 1 seconde irl).
 * @default 5
 *
 * @param Transition Frames
 * @desc Le nombre de frames pour la transition entre chaque teinte.
 * @default 600
 *
 * @param Frame On Exit
 * @desc Le nombre de frames pour la transition de teinte lors de la sortie d'un lieu.
 * @default 0
 *
 * @param Switch Matin
 * @desc Le switch correspondant à la période du matin
 * @default 1
 *
 * @param Switch Journee
 * @desc Le switch correspondant à la période de la journée
 * @default 2
 *
 * @param Switch Soir
 * @desc Le switch correspondant à la période du soir
 * @default 3
 *
 * @param Switch Nuit
 * @desc Le switch correspondant à la période de la nuit
 * @default 4
 *
 * @param TeinteDongeon
 * @desc La teinte souhaitée pour l'intérieur des dongeons (format: [R, G, B, Gray])
 * @default [-200, -200, -200, 0]
 *
 * @param TeinteMatin
 * @desc La teinte souhaitée pour le matin (format: [R, G, B, Gray])
 * @default [-16, -84, -118, 120]
 *
 * @param TeinteJournee
 * @desc La teinte souhaitée pour la journée (format: [R, G, B, Gray])
 * @default [0, 0, 0, 0]
 *
 * @param TeinteSoir
 * @desc La teinte souhaitée pour le soir (format: [R, G, B, Gray])
 * @default [-42, -134, -134, 100]
 *
 * @param TeinteNuit
 * @desc La teinte souhaitée pour la nuit (format: [R, G, B, Gray])
 * @default [-200, -200, -100, 68]
 *
 * @help Ce plugin permet d'ajouter un système jour/nuit au jeu.
 * Une journée est divisée en 4 phases.
 * La teinte de l'écran change en fonction de l'heure.
 * Les heures, minutes et secondes se trouvent dans les variables du jeu
 * (respectivement 1, 2 et 3 par défaut).
 * Servez-vous en pour les afficher ou pour définir des heures d'ouverture
 * pour les magasins par exemple.
 *
 * Pour désactiver les teintes, utilisez la commande de plugin suivante :
 * DisableTint
 *
 * Pour réactiver les teintes, utilisez la commande de plugin suivante :
 * EnableTint
 * /!\ Chaque Map où vous souhaitez que le système jour/nuit soit actif doit
 * contenir un EnableTint.
 *
 * Pour que la teinte se mette à jour instantanément lors de la sortie d'un
 * lieu où la gestion des teintes était désactivée, utilisez la commande
 * de plugin suivante : EnableTintOnExit
 * /!\ A mettre dans l'événement de la porte de sortie du bâtiment juste avant
 * la téléportation.
 *
 * Pour définir la teinte dans un donjon (modifiable à la ligne 239)
 * utilisez la commande de plugin suivante : DungeonTint
 * /!\ A mettre dans un événement parallèle.
 *
 * Pour ajouter manuellement des heures, utilisez la commande de plugin
 * suivante : AddHours x
 * Remplacez x par le nombre d'heures à ajouter.
 * Par exemple, s'il est 23h dans le jeu et que vous ajoutez 8h, il sera 7h.
 *
 * Par défaut, les interrupteurs 1, 2, 3 et 4 sont utilisés pour connaître la
 * période en cours (matin, journée, soir, nuit). Vous pouvez les changer
 * en fonction de vos interrupteurs dans les paramètres.
 * Cela permet, via une seule condition (Si interrupteur 4 = ON alors...), de
 * permettre un événement en fonction de l'heure (par exemple, un magasin qui
 * ne serait ouvert que le jour, un donjon accessible seulement la nuit, etc.).
 *
 * Les teintes se mettent à jour automatiquement en fonction de l'heure du jeu
 * sur une durée définie en frames dans le paramètre "Frames par seconde".
 */

(function() {
    var parameters = PluginManager.parameters('Revahar - Plugin JourNuit RPGMMV');
    var varMatin = parseInt(parameters['Variable Matin']);
    var varJournee = parseInt(parameters['Variable Journee']);
    var varSoir = parseInt(parameters['Variable Soir']);
    var varNuit = parseInt(parameters['Variable Nuit']);
    var matinHeure = parseInt(parameters['Matin Heure']);
    var journeeHeure = parseInt(parameters['Journee Heure']);
    var soirHeure = parseInt(parameters['Soir Heure']);
    var nuitHeure = parseInt(parameters['Nuit Heure']);
    var switchMatin = parseInt(parameters['Switch Matin']);
    var switchJournee = parseInt(parameters['Switch Journee']);
    var switchSoir = parseInt(parameters['Switch Soir']);
    var switchNuit = parseInt(parameters['Switch Nuit']);
    var heureFrames = parseInt(parameters['Frames par seconde']);
    var transitionFrames = parseInt(parameters['Transition Frames']);
    var frameOnExit = parseInt(parameters['Frame On Exit']);
    var tintEnabled = true;
    var tintOnExit = false;
    var dungeonTintValue = false;
    var currentTint = null;
    var targetTint = null;
    var frameCount = 0;

    // Turn off tints
    function disableTint() {
        tintEnabled = false;
        updateTint();
    }

    // Reactivate tints
    function enableTint() {
        transitionFrames = parseInt(parameters['Transition Frames']);
        tintEnabled = true;
        updateTint();
    }

    // Reactivate colors when exiting buildings/dungeons
    function enableTintOnExit() {
        tintOnExit = true;
        updateTint();
    }

    // Set tint for dungeons/caves
    function dungeonTint() {
        dungeonTintValue = true;
        updateTint();
    }

    // Add hours
    function addHours(hours) {
        var currentTime = $gameVariables.value(1); // Variable contenant l'heure
        var newTime = currentTime + hours;

        // Manage passing midnight
        if (newTime >= 24) {
            newTime -= 24;
        } else if (newTime < 0) {
            newTime += 24;
        }

        $gameVariables.setValue(1, newTime);
        updateTint();
    }

    // Update tint
    function updateTint() {
        var currentTime = $gameVariables.value(1); // Variable containing the time
        var periodeMatin = $gameSwitches.value(switchMatin); // Switch determining the morning period (OFF = not morning, ON = morning)
        var periodeJournee = $gameSwitches.value(switchJournee); // Switch determining the day period (OFF = no day, ON = day)
        var periodeSoir = $gameSwitches.value(switchSoir); // Switch determining the evening period (OFF = no evening, ON = evening)
        var periodeNuit = $gameSwitches.value(switchNuit); // Switch determining the night period (OFF = no night, ON = night)

        // Determine current phase based on time
        var phase = 'matin';
        if (currentTime >= matinHeure && currentTime < journeeHeure) {
            phase = 'matin';
            periodeMatin = true;
            periodeJournee = false;
            periodeSoir = false;
            periodeNuit = false;
        } else if (currentTime >= journeeHeure && currentTime < soirHeure) {
            phase = 'journee';
            periodeMatin = false;
            periodeJournee = true;
            periodeSoir = false;
            periodeNuit = false;
        } else if (currentTime >= soirHeure && currentTime < nuitHeure) {
            phase = 'soir';
            periodeMatin = false;
            periodeJournee = false;
            periodeSoir = true;
            periodeNuit = false;
        } else {
            phase = 'nuit';
            periodeMatin = false;
            periodeJournee = false;
            periodeSoir = false;
            periodeNuit = true;
        }

        $gameSwitches.setValue(varMatin, periodeMatin);
        $gameSwitches.setValue(varJournee, periodeJournee);
        $gameSwitches.setValue(varSoir, periodeSoir);
        $gameSwitches.setValue(varNuit, periodeNuit);

        // Obtain the tint corresponding to the phase
        var targetTint = getTintByPhase(phase);

        // Change tint when exiting building/dungeon
        if (tintOnExit) {
            currentTint = targetTint;
            transitionFrames = frameOnExit;
            $gameScreen.startTint(currentTint, transitionFrames);
            tintOnExit = false;
            return;
        }

        // Set the tint of dungeons/caves/etc.
        if (dungeonTintValue) {
            currentTint = JSON.parse(parameters['TeinteDongeon']);
            $gameScreen.startTint(currentTint, 0);
            dungeonTintValue = false;
            return;
        }

        // Disable tint if tintEnabled is false
        if (!tintEnabled) {
            currentTint = [0, 0, 0, 0];
            $gameScreen.startTint(currentTint, 0);
            return;
        }

        // Gradually update the tint
        if (currentTint === null) {
            currentTint = targetTint;
            $gameScreen.startTint(currentTint, transitionFrames);
        } else if (!tintEquals(currentTint, targetTint)) {
            currentTint = targetTint;
            $gameScreen.startTint(currentTint, transitionFrames);
        }
    }

    // Check if two shades are the same
    function tintEquals(tint1, tint2) {
        return (
            tint1[0] === tint2[0] &&
            tint1[1] === tint2[1] &&
            tint1[2] === tint2[2] &&
            tint1[3] === tint2[3]
        );
    }

    // Get tint based on phase
    function getTintByPhase(phase) {
        switch (phase) {
            case 'matin':
                return JSON.parse(parameters['TeinteMatin']);
            case 'journee':
                return JSON.parse(parameters['TeinteJournee']);
            case 'soir':
                return JSON.parse(parameters['TeinteSoir']);
            case 'nuit':
                return JSON.parse(parameters['TeinteNuit']);
            default:
                return [0, 0, 0, 0];
        }
    }

    // Update tint every frame
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        frameCount++;
        if (frameCount % heureFrames === 0) {
            var currentTime = $gameVariables.value(1); // Variable containing hours
            var currentMinutes = $gameVariables.value(2); // Variable containing the minutes
            var currentSeconds = $gameVariables.value(3); // Variable containing the seconds

            currentSeconds += 1;

            // Manage overruns of seconds and minutes
            if (currentSeconds >= 60) {
                currentSeconds = 0;
                currentMinutes ++;

                if (currentMinutes >= 60) {
                    currentMinutes = 0;
                    currentTime ++;

                    if (currentTime >= 24) {
                        currentTime = 0;
                    }
                }
            }

            $gameVariables.setValue(1, currentTime);
            $gameVariables.setValue(2, currentMinutes);
            $gameVariables.setValue(3, currentSeconds);
            updateTint();
        }
    };

    // Plugin command Management
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === 'DisableTint') {
            disableTint();
        } else if (command === 'EnableTint') {
            enableTint();
        } else if (command === 'EnableTintOnExit') {
            enableTintOnExit();
        } else if (command === 'DungeonTint') {
            dungeonTint();
        } else if (command === 'AddHours') {
            var hours = parseInt(args[0]);
            addHours(hours);
        }
    };
})();
