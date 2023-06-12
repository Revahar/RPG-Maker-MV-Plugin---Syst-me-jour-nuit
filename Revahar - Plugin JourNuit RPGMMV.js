//=============================================================================
// Revahar - Plugin Jour/Nuit RPGMMV
//=============================================================================

/*:
 * @plugindesc Plugin de système jour/nuit pour RPG Maker MV.
 * Version 1.0
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
 * @help Ce plugin permet d'ajouter un système jour/nuit au jeu. 
 * Une journée est divisée en 4 phases. 
 * La teinte de l'écran change en fonction de l'heure.
 * Les heures, minutes et secondes se trouvent dans les varibales du jeu 
 * (respectivement 1, 2 et 3 par défaut).
 * Servez vous en pour les afficher ou pour définir des heures d'ouverture 
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
 * de plugin : EnableTintOnExit
 * /!\ À mettre dans l'évènement de la porte de sortie du bâtiment juste avant
 * la téléportation.
 * 
 *  Pour définir la teinte dans un dongeon (modifiable à la ligne 239)
 *  utilisez la commande de plugin : DungeonTint
 * /!\ À mettre dans un évènement parallèle.
 *
 * Pour ajouter manuellement des heures, utilisez la commande de plugin 
 * suivante : AddHours x
 * Remplacez x par le nombre d'heures à ajouter.
 * Par exemple, si il est 23h en jeu et que vous ajoutez 8h, il sera 7h.
 * 
 * Par défaut, les switch 1, 2, 3 et 4 sont utilisées pour connaitre la
 * période en cours (matin, journée, soir, nuit). Vous pouvez les modifier 
 * selon vos switches dans les paramètres.
 * Cela permet, via une seule condition (Si variable 4 = ON alors ...) de
 * permettre un évènement en fonction de la période du jour (par exemple
 * un magasin qui ne serait ouvert que la journée, un donjon accessible que
 * la nuit, etc.) 
 *
 * Les teintes se mettent à jour automatiquement en fonction
 * de l'heure en jeu.
 */

(function() {
    var parameters = PluginManager.parameters('JourNuit');
    var varMatin = parseInt(parameters['Variable Matin']);
    var varJournee = parseInt(parameters['Variable Journee']);
    var varSoir = parseInt(parameters['Variable Soir']);
    var varNuit = parseInt(parameters['Variable Nuit']);
    var matinHeure = parseInt(parameters['Matin Heure']);
    var journeeHeure = parseInt(parameters['Journee Heure']);
    var soirHeure = parseInt(parameters['Soir Heure']);
    var nuitHeure = parseInt(parameters['Nuit Heure']);
    var switchMatin = parseInt(parameters['Switch Matin']);
    var switchJournee = parseInt(parameters['Switch Journée']);
    var switchSoir = parseInt(parameters['Switch Soir']);
    var switchNuit = parseInt(parameters['Switch Nuit']);
    var heureFrames = parseInt(parameters['Frames par seconde']);
    var transitionFrames = parseInt(parameters['Transition Frames']);
    var tintEnabled = true;
    var tintOnExit = false;
    var dungeonTintValue = false;
    var currentTint = null;
    var targetTint = null;
    var frameCount = 0;

    // Désactiver les teintes
    function disableTint() {
        tintEnabled = false;
        updateTint();
    }

    // Réactiver les teintes
    function enableTint() {
        transitionFrames = parseInt(parameters['Transition Frames']);;
        tintEnabled = true;
        updateTint();
    }

    // Réactiver les teintes en sortie de bâtiment/donjon
    function enableTintOnExit() {
        tintOnExit = true;
        updateTint();
    }

    // Définir une teinte pour les donjons/cavernes/grottes
    function dungeonTint() {
        dungeonTintValue = true;
        updateTint();
    }

    // Ajouter des heures
    function addHours(hours) {
        var currentTime = $gameVariables.value(1); // Variable contenant l'heure
        var newTime = currentTime + hours;

        // Gérer le dépassement de minuit
        if (newTime >= 24) {
            newTime -= 24;
        } else if (newTime < 0) {
            newTime += 24;
        }

        $gameVariables.setValue(1, newTime);
        updateTint();
    }

    

// Mettre à jour la teinte
function updateTint() {
 

        var currentTime = $gameVariables.value(1); // Variable contenant l'heure
        var periodeMatin = $gameSwitches.value(switchMatin); // Switch déterminant la période matin (OFF = pas matin, ON = matin)
        var periodeJournee = $gameSwitches.value(switchJournee); // Switch déterminant la période jour (OFF = pas jour, ON = jour)
        var periodeSoir = $gameSwitches.value(switchSoir); // Switch déterminant la période soir (OFF = pas soir, ON = soir)
        var periodeNuit = $gameSwitches.value(switchNuit); // Switch déterminant la période nuit (OFF = pas nuit, ON = nuit)


        // Déterminer la phase actuelle en fonction de l'heure
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




        // Obtenir la teinte correspondante à la phase
        var targetTint = getTintByPhase(phase);

        // Changer la teinte en sortie de bâtiment/donjon
        // modifiez transitionFrames en fonction de la durée de la transition souhaité (exemple : 60 frames = 1 seconde)
        if (tintOnExit) {
            currentTint = targetTint
            transitionFrames = 0; //<- remplacez le "0" par le nombre de frames souhaité
            $gameScreen.startTint(currentTint, transitionFrames);
            tintOnExit = false;
            return;
        }

        // défini la teinte des donjons/grottes/etc.
        if (dungeonTintValue) {
            currentTint = [-200, -200, -200, 0];  //<- modifier ici les valeurs pour obtenir la teinte souhaitée
            $gameScreen.startTint(currentTint, 0);
            dungeonTintValue = false;
            return;
        } 

        // Désactive la teinte si tintEnabled est = false
        if (!tintEnabled) {
            currentTint = [0, 0, 0, 0];
            $gameScreen.startTint(currentTint, 0);
            return;
        } 

        // Mettre à jour la teinte de façon progressive
        if (currentTint === null) {
            currentTint = targetTint;
            $gameScreen.startTint(currentTint, transitionFrames);
        } else if (!tintEquals(currentTint, targetTint)) {
            currentTint = targetTint;
            $gameScreen.startTint(currentTint, transitionFrames);
        }
    }

    // Vérifier si deux teintes sont identiques
    function tintEquals(tint1, tint2) {
        return (
            tint1[0] === tint2[0] &&
            tint1[1] === tint2[1] &&
            tint1[2] === tint2[2] &&
            tint1[3] === tint2[3]
        );
    }

    // Obtenir la teinte en fonction de la phase
    function getTintByPhase(phase) {
        switch (phase) {
            case 'matin':
                return [-16, -84, -118, 120];
            case 'journee':
                return [0, 0, 0, 0];
            case 'soir':
                return [-42, -134, -134, 100];
            case 'nuit':
                return [-200, -200, -100, 68];
            default:
                return [0, 0, 0, 0];
        }
    }

    // Mettre à jour la teinte à chaque frame
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        frameCount++;
        if (frameCount % heureFrames === 0) {
            var currentTime = $gameVariables.value(1); // Variable contenant l'heure
            var currentMinutes = $gameVariables.value(2); // Variable contenant les minutes
            var currentSeconds = $gameVariables.value(3); // Variable contenant les secondes

            currentSeconds += 1;

            // Gérer les dépassements des secondes et des minutes
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

    // Gestion des commandes de plugin
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === 'DisableTint') {
            disableTint();
        } else if (command === 'EnableTint') {
            enableTint();
        } else if (command === 'EnableTintOnExit'){
            enableTintOnExit();
        } else if (command === 'DungeonTint'){
            dungeonTint();
        } else if (command === 'AddHours') {
            var hours = parseInt(args[0]);
            addHours(hours);
        }
    };
})();
