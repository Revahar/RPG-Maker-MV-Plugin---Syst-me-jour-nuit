//=============================================================================
// Revahar - Plugin Day/Night RPGMMV
//=============================================================================

/*:
 * @plugindesc Day/Night Plugin for RPG Maker MV.
 * Version 1.0
 * @author Revahar
 *
 * @param Variable Matin
 * @desc The variable containing the morning start time
 * @default 1
 *
 * @param Variable Journee
 * @desc The variable containing the time of the start of the day
 * @default 2
 *
 * @param Variable Soir
 * @desc The variable containing the evening start time
 * @default 3
 *
 * @param Variable Nuit
 * @desc The variable containing the time of the beginning of the night
 * @default 4
 *
 * @param Matin Heure
 * @desc The time at which the morning phase begins.
 * @default 6
 *
 * @param Journee Heure
 * @desc The time at which the phase of the day begins.
 * @default 8
 *
 * @param Soir Heure
 * @desc The time at which the evening phase begins.
 * @default 19
 *
 * @param Nuit Heure
 * @desc The time at which the night phase begins.
 * @default 21
 *
 * @param Frames par seconde
 * @desc The number of frames needed to make one second (60 frames = 1 second irl).
 * @default 5
 *
 * @param Transition Frames
 * @desc The number of frames for the transition between each hue.
 * @default 600
 *
 * @param Switch Matin
 * @desc The switch corresponding to the morning period
 * @default 1
 *
 * @param Switch Journee
 * @desc The switch corresponding to the time of day
 * @default 2
 *
 * @param Switch Soir
 * @desc The switch corresponding to the evening period
 * @default 3
 *
 * @param Switch Nuit
 * @desc The switch corresponding to the period of the night
 * @default 4
 *
 * @help This plugin adds a day/night system to the game.
 * A day is divided into 4 phases.
 * The tint of the screen changes according to the time.
 * Hours, minutes and seconds can be found in the in-game variables
 * (respectively 1, 2 and 3 by default).
 * Use it to display them or to define opening hours
 * for stores for example.
 *
 * To disable tints, use the following plugin command:
 * DisableTint
 *
 * To re-enable tints, use the following plugin command:
 * EnableTint
 * /!\ Each Map where you want the day/night system to be active must
 * contain an EnableTint.
 *
 * To have the hue update instantly when outputting a
 * where tint management was disabled, use the plugin
 * command : EnableTintOnExit
 * /!\To put in the event of the exit door of the building just before
 * teleportation.
 *
 *  To set the tint in a dungeon (editable at line 239)
 *  use plugin command : DungeonTint
 * /!\ To be put in a side event.
 *
 * To manually add hours, use the plugin
 * command : AddHours x
 * Replace x with the number of hours to add.
 * For example, if it is 11 p.m. in game and you add 8h., it will be 7 a.m.
 *
 * By default, switches 1, 2, 3 and 4 are used to know the
 * current period (morning, day, evening, night). You can change them
 * depending on your switches in the settings.
 * This allows, via a single condition (If switch 4 = ON then ...) to
 * allow an event depending on the time of day (for example
 * a store that would only be open during the day, a dungeon accessible only
 * at night, etc.)
 *
 * Shades update automatically based on time game over a duration defined
 * in frames in the "frames par seconde" parameter.
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

    // Turn off tints
    function disableTint() {
        tintEnabled = false;
        updateTint();
    }

    // Reactivate tints
    function enableTint() {
        transitionFrames = parseInt(parameters['Transition Frames']);;
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
        // modify transitionFrames according to the duration of the desired transition (example: 60 frames = 1 second)
        if (tintOnExit) {
            currentTint = targetTint
            transitionFrames = 0; //<-replace the "0" with the desired number of frames
            $gameScreen.startTint(currentTint, transitionFrames);
            tintOnExit = false;
            return;
        }

        // set the tint of dungeons/caves/etc.
        if (dungeonTintValue) {
            currentTint = [-200, -200, -200, 0];  //<- modify the values here to obtain the desired shade
            $gameScreen.startTint(currentTint, 0);
            dungeonTintValue = false;
            return;
        }

        // Disable tint if tintEnabled is = false
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