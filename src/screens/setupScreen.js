import { Player } from '../core/Player.js';
import { GameSetup } from '../view/components/GameSetup.js';
import { DOM } from '../view/domElements.js';

export const setupScreen = {
    initPlayerOne(userData) {
        DOM.$form.classList.add('is-hidden');
        DOM.$battlefieldSection.classList.remove('is-hidden');
        DOM.$rules.classList.remove('is-hidden');
        DOM.$controlsSection.classList.remove('is-hidden');
        DOM.$boards[0].parentElement.classList.remove('is-hidden');
        DOM.$boards[1].parentElement.classList.add('is-hidden');

        const playerOne = new Player(userData.nameOne, 'human');
        // лишняя абстракция?
        const activeSetup = GameSetup.startSetupPhase(
            playerOne,
            DOM.$boards[0],
            DOM.$btnReadyOne,
            userData.isBot
        );

        userData.isBot
            ? DOM.$btnReadyOne.classList.add('is-hidden')
            : DOM.$btnReadyOne.classList.remove('is-hidden');

        return { playerOne, activeSetup };
    },
    // activeSetup, oldSetup, newSetup лишняя абстракция
    transitionToPlayerTwo(p2Name, oldSetup) {
        DOM.$boards[0].parentElement.classList.add('is-hidden');
        DOM.$boards[1].parentElement.classList.remove('is-hidden');
        oldSetup.resetShipButtons();

        const playerTwo = new Player(p2Name, 'human');

        const newSetup = GameSetup.startSetupPhase(
            playerTwo,
            DOM.$boards[1],
            DOM.$fightBtn,
            false
        );
        newSetup.resetBoard();

        return { playerTwo, activeSetup: newSetup };
    },

    setupBot(botName) {
        const botPlayer = new Player(botName, 'bot');
        botPlayer.gameboard.placeAllShipsRandomly();

        DOM.$randomBtn.classList.add('is-hidden');
        DOM.$resetBtn.classList.add('is-hidden');
        DOM.$btnReadyOne.classList.add('is-hidden');

        if (DOM.$btnReadyTwo) DOM.$btnReadyTwo.classList.add('is-hidden');

        DOM.$boards[1].parentElement.classList.remove('is-hidden');
        DOM.$boards[1].classList.add('board--overlay');

        DOM.$fightBtn.classList.add('is-hidden');
        return botPlayer;
    },
};
