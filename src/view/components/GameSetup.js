import { DOM } from '../domElements.js';
import { ShipDragDrop } from './ShipDragDrop.js';
import { boardView } from './boardView.js';

export class GameSetup {
    constructor(
        player,
        dragDrop,
        boardElement,
        replaceShipsElement,
        readyBtn,
        isBotMode
    ) {
        this.player = player;
        this.dragDrop = dragDrop;
        this.boardElement = boardElement;
        this.replaceShipsElement = replaceShipsElement;
        this.readyBtnElement = readyBtn;
        this.isBotMode = isBotMode;
    }

    randomizeShips() {
        this.player.gameboard.placeAllShipsRandomly();
        boardView.render(this.player, this.boardElement);
        this.dragDrop.updateShipButtons();
        this.updateButtonStates();

        if (typeof this.dragDrop.onStateChanged === 'function') {
            this.dragDrop.onStateChanged();
        }
    }

    resetBoard() {
        this.player.gameboard.resetBoard();
        boardView.render(this.player, this.boardElement);
        this.resetShipButtons();
        this.updateButtonStates();
        this.boardElement.classList.remove('board--overlay');
    }

    resetShipButtons() {
        const limits = this.player.gameboard.SHIP_LIMITS;

        this.replaceShipsElement
            .querySelectorAll('.js-ship-text')
            .forEach((shipText) => {
                const size = shipText.dataset.size;
                shipText.classList.remove('is-hidden', 'is-disabled');
                shipText.dataset.count = limits[size];
                shipText.dataset.direction = 'horizontal';
                this.dragDrop.toggleRotateShipBtn(shipText, true);
            });

        this.replaceShipsElement
            .querySelectorAll('.js-turn-over')
            .forEach((btn) => {
                btn.classList.remove('is-hidden');
            });
    }

    updateButtonStates() {
        const board = this.player.gameboard;
        const allShipsPlaced = board.allShipsPlaced();

        DOM.$resetBtn.disabled = !board.hasAnyShips();

        if (this.isBotMode) {
            DOM.$fightBtn.disabled = !allShipsPlaced;
            return;
        }

        if (this.readyBtnElement === DOM.$fightBtn) {
            DOM.$fightBtn.disabled = !allShipsPlaced;
        } else {
            this.readyBtnElement.disabled = !allShipsPlaced;
        }
    }

    terminate() {
        this.boardElement.classList.add('board--overlay');
        boardView.render(this.player, this.boardElement);
        this.resetShipButtons();
    }

    handleReadyClick() {
        this.boardElement.classList.add('board--overlay');
        boardView.render(this.player, this.boardElement);

        if (this.readyBtnElement) {
            this.readyBtnElement.disabled = true;
            this.readyBtnElement.classList.add('is-hidden');
        }
    }

    static startSetupPhase(player, boardElement, readyBtn, isBotMode) {
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
        boardView.render(player, boardElement);

        dragDrop.onStateChanged = () => gameSetup.updateButtonStates();

        return gameSetup;
    }
}
