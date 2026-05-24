import { GameControl } from './core/GameControl.js';
import { Player } from './core/Player.js';
import { gameScreen } from './screens/gameScreen.js';
import { restartToMenu } from './screens/restartToMenu.js';
import { setupScreen } from './screens/setupScreen.js';
import './styles.css';
import { boardView } from './view/components/boardView.js';
import { getDataUser } from './view/components/dataUser.js';
import { directionShip } from './view/components/directionShip.js';
import { modalView } from './view/components/modalView.js';
import { soundManager } from './view/components/soundManager.js';
import { DOM } from './view/domElements.js';
modalView.init();
let playerOne, playerTwo, activeSetup, gameControl;

soundManager.playBGM();

// Step of settings the game
DOM.$startGameBtn.addEventListener('click', () => {
    const userData = getDataUser();
    const result = setupScreen.initPlayerOne(userData);
    playerOne = result.playerOne;
    activeSetup = result.activeSetup;
});

DOM.$btnReadyOne.addEventListener('click', () => {
    const { nameTwo } = getDataUser();
    activeSetup.handleReadyClick();
    DOM.$btnReadyOne.classList.add('is-hidden');

    const result = setupScreen.transitionToPlayerTwo(nameTwo, activeSetup);
    playerTwo = result.playerTwo;
    activeSetup = result.activeSetup;
});

// Start the game
DOM.$fightBtn.addEventListener('click', () => {
    const { nameTwo, isBot } = getDataUser();

    if (isBot) {
        playerTwo = new Player(nameTwo, 'bot');
        playerTwo.gameboard.placeAllShipsRandomly();
    }

    gameControl = new GameControl(playerOne, playerTwo);
    gameScreen.init(gameControl);
    gameControl.startGame();

    boardView.render(playerOne, DOM.$boards[0], false);
    boardView.render(playerTwo, DOM.$boards[1], true);

    modalView.show(gameControl.currentPlayer.name, 'start');
});

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
        if (
            targetPlayer.gameboard.firedShots.has(
                targetPlayer.gameboard.coordKey(x, y)
            )
        )
            return;

        gameControl.handleAttack(x, y);

        boardView.render(targetPlayer, DOM.$boards[boardIndex], true);

        const winnerMessage = gameControl.checkGameOver();
        if (winnerMessage) {
            soundManager.stopBGM();
            soundManager.playEffects('win');
            modalView.show(winnerMessage, 'win');
            return;
        }

        if (gameControl.playerTwo.type === 'bot') {
            gameScreen.handleBotResponse(gameControl);
        } else {
            setTimeout(
                () => gameScreen.handleHumanTurnTransition(gameControl),
                600
            );
        }
    });
});

DOM.$soundToggleBtn.addEventListener('click', () => {
    const isMuted = soundManager.toggleBGM();

    if (isMuted) {
        DOM.$soundToggleBtn.textContent = '🔇 Unmute Music';
        DOM.$soundToggleBtn.classList.add('btn--muted');
    } else {
        DOM.$soundToggleBtn.textContent = '🔊 Mute Music';
        DOM.$soundToggleBtn.classList.remove('btn--muted');
    }
});

DOM.$randomBtn.addEventListener('click', () => activeSetup.randomizeShips());
DOM.$resetBtn.addEventListener('click', () => activeSetup.resetBoard());
DOM.$replaceShipsDock.addEventListener('click', (e) => {
    directionShip(e);
    if (activeSetup) activeSetup.updateButtonStates();
});
DOM.$restartBtn.addEventListener('click', () => {
    soundManager.playBGM();
    if (activeSetup) activeSetup.resetBoard();
    playerOne = null;
    playerTwo = null;
    restartToMenu();
});
