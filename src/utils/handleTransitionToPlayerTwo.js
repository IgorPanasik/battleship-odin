import { DOM } from '../dom/dom.js';
import { Player } from '../services/Player.js';
import { startSetupPhase } from './startSetupPhase.js';

export const handleTransitionToPlayerTwo = (p2Name, oldSetup) => {
    DOM.$boards[0].parentElement.classList.add('is-hidden');
    DOM.$boards[1].parentElement.classList.remove('is-hidden');
    oldSetup.resetShipButtons();

    const playerTwo = new Player(p2Name, 'human');

    const newSetup = startSetupPhase(
        playerTwo,
        DOM.$boards[1],
        DOM.$fightBtn,
        false
    );

    newSetup.resetBoard();

    return { newSetup, playerTwo };
};
