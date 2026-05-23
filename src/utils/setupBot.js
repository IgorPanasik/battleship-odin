import { DOM } from '../dom/dom.js';
import { Player } from '../services/Player.js';

export const setupBot = (botName, playerTwo) => {
    playerTwo = new Player(botName, 'bot');
    playerTwo.gameboard.placeAllShipsRandomly();
    DOM.$randomBtn.classList.add('is-hidden');
    DOM.$resetBtn.classList.add('is-hidden');
    DOM.$btnReadyOne.classList.add('is-hidden');
    DOM.$btnReadyTwo.classList.add('is-hidden');
    DOM.$boards[1].parentElement.classList.remove('is-hidden');
    DOM.$boards[1].classList.add('board--overlay');

    DOM.$fightBtn.classList.add('is-hidden');
};
