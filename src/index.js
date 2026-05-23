import { DOM } from './dom/dom.js';
import { getDataUser } from './dom/listeners/dataUser.js';
import { directionShip } from './dom/listeners/directionShip.js';
import { GameControl } from './services/GameControl.js';
import { Player } from './services/Player.js';
import './styles.css';
import { handleTransitionToPlayerTwo } from './utils/handleTransitionToPlayerTwo.js';
import { restartToMenu } from './utils/restartToMenu.js';
import { showStartModal } from './utils/showStartModal.js';
import { startSetupPhase } from './utils/startSetupPhase.js';

let playerOne, playerTwo, activeSetup, gameControl;

// Step of settings the game
DOM.$startGameBtn.addEventListener('click', () => {
    const { nameOne, nameTwo, isBot } = getDataUser();
    DOM.$form.classList.add('is-hidden');
    DOM.$battlefieldSection.classList.remove('is-hidden');
    DOM.$rules.classList.remove('is-hidden');
    DOM.$controlsSection.classList.remove('is-hidden');
    DOM.$boards[0].parentElement.classList.remove('is-hidden');
    DOM.$boards[1].parentElement.classList.add('is-hidden');

    playerOne = new Player(nameOne, 'human');

    activeSetup = startSetupPhase(
        playerOne,
        DOM.$boards[0],
        DOM.$btnReadyOne,
        isBot
    );

    if (isBot) {
        DOM.$btnReadyOne.classList.add('is-hidden');
    } else {
        DOM.$btnReadyOne.classList.remove('is-hidden');
    }
});

DOM.$btnReadyOne.addEventListener('click', () => {
    const { nameTwo } = getDataUser();
    activeSetup.handleReadyClick();

    DOM.$btnReadyOne.classList.add('is-hidden');

    const result = handleTransitionToPlayerTwo(nameTwo, activeSetup);
    playerTwo = result.playerTwo;
    activeSetup = result.newSetup;
});

// Start the game
DOM.$fightBtn.addEventListener('click', () => {
    const { nameOne, nameTwo, isBot } = getDataUser();

    if (isBot) {
        playerTwo = new Player(nameTwo, 'bot');
        playerTwo.gameboard.placeAllShipsRandomly();
    }

    gameControl = new GameControl(playerOne, playerTwo);

    DOM.$controlsSection.classList.add('is-hidden');
    DOM.$rules.classList.add('is-hidden');
    DOM.$restartBtn.classList.remove('is-hidden');
    DOM.$turnDisplay.classList.remove('is-hidden');
    DOM.$boards.forEach((b) => {
        b.parentElement.classList.remove('is-hidden');
        b.classList.remove('board--overlay');
    });
    DOM.$turnDisplay.textContent = `Move is: ${gameControl.currentPlayer.name}`;

    gameControl.startGame();

    playerOne.renderBoard(DOM.$boards[0], false);
    playerTwo.renderBoard(DOM.$boards[1], true);

    showStartModal(gameControl.currentPlayer.name, 'start');
});

DOM.$randomBtn.addEventListener('click', () => activeSetup.randomizeShips());
DOM.$resetBtn.addEventListener('click', () => activeSetup.resetBoard());
DOM.$replaceShipsDock.addEventListener('click', (e) => {
    directionShip(e);
    if (activeSetup) activeSetup.updateButtonStates();
});
DOM.$restartBtn.addEventListener('click', () => {
    activeSetup.resetBoard();
    playerOne = null;
    playerTwo = null;
    restartToMenu();
});

const handleHumanTurnTransition = () => {
    showStartModal(gameControl.currentPlayer.name, 'turn');

    DOM.$turnDisplay.textContent = `Move is: ${gameControl.currentPlayer.name}`;

    if (gameControl.currentPlayer === gameControl.playerOne) {
        playerOne.renderBoard(DOM.$boards[0], false);
        playerTwo.renderBoard(DOM.$boards[1], true);
    } else {
        playerOne.renderBoard(DOM.$boards[0], true);
        playerTwo.renderBoard(DOM.$boards[1], false);
    }
};

DOM.$boards.forEach((boardElement, boardIndex) => {
    boardElement.addEventListener('click', (e) => {
        if (!gameControl || !gameControl.gameActive) return;

        if (
            gameControl.currentPlayer === gameControl.playerOne &&
            boardIndex !== 1
        )
            return;

        if (
            gameControl.currentPlayer === gameControl.playerTwo &&
            boardIndex !== 0
        )
            return;

        const cell = e.target.closest('.cell');
        if (!cell) return;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        const targetPlayer =
            gameControl.currentPlayer === gameControl.playerOne
                ? gameControl.playerTwo
                : gameControl.playerOne;
        const coordKey = targetPlayer.gameboard.coordKey(x, y);

        if (targetPlayer.gameboard.firedShots.has(coordKey)) return;

        gameControl.handleAttack(x, y);

        targetPlayer.renderBoard(DOM.$boards[boardIndex], true);

        const winnerMessage = gameControl.checkGameOver();
        if (winnerMessage) {
            showStartModal(winnerMessage, 'win');
            return;
        }

        if (gameControl.playerTwo.type === 'bot') {
            DOM.$turnDisplay.textContent = `Move is: ${gameControl.playerTwo.name}`;
            setTimeout(() => {
                if (!gameControl.gameActive) return;
                gameControl.handleAttack();
                gameControl.playerOne.renderBoard(DOM.$boards[0], false);

                const botWinnerMessage = gameControl.checkGameOver();
                if (botWinnerMessage) {
                    showStartModal(botWinnerMessage, 'win');
                    return;
                }
                DOM.$turnDisplay.textContent = `Move is: ${gameControl.playerOne.name}`;
            }, 500);
        } else {
            setTimeout(() => {
                handleHumanTurnTransition();
            }, 600);
        }
    });
});
