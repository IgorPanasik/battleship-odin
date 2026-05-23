import { DOM } from '../dom/dom.js';
import { GameSetup } from '../services/GameSetup.js';
import { ShipDragDrop } from '../services/ShipDragDrop.js';

export const startSetupPhase = (player, boardElement, readyBtn, isBotMode) => {
    const dragDrop = new ShipDragDrop(
        player,
        boardElement,
        DOM.$replaceShipsDock
    );
    const gameSetup = new GameSetup(
        player,
        dragDrop,
        boardElement,
        DOM.$replaceShipsDock,
        readyBtn,
        isBotMode
    );

    dragDrop.init();
    player.renderBoard(boardElement);

    dragDrop.onStateChanged = () => gameSetup.updateButtonStates();

    return gameSetup;
};
