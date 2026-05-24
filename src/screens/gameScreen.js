import { boardView } from '../view/components/boardView.js';
import { modalView } from '../view/components/modalView.js';
import { soundManager } from '../view/components/soundManager.js';
import { DOM } from '../view/domElements.js';

export const gameScreen = {
    init(gameControl) {
        DOM.$controlsSection.classList.add('is-hidden');
        DOM.$rules.classList.add('is-hidden');
        DOM.$restartBtn.classList.remove('is-hidden');
        DOM.$turnDisplay.classList.remove('is-hidden');

        DOM.$boards.forEach((b) => {
            b.parentElement.classList.remove('is-hidden');
            b.classList.remove('board--overlay');
        });

        this.updateTurnDisplay(gameControl.currentPlayer.name);
        this.updateLabels(gameControl);
    },

    updateTurnDisplay(name) {
        DOM.$turnDisplay.textContent = `Move is: ${name}`;
    },

    handleHumanTurnTransition(gameControl) {
        modalView.show(gameControl.currentPlayer.name, 'turn');
        this.updateTurnDisplay(gameControl.currentPlayer.name);

        this.updateLabels(gameControl);

        const isP1 = gameControl.currentPlayer === gameControl.playerOne;
        boardView.render(gameControl.playerOne, DOM.$boards[0], !isP1);
        boardView.render(gameControl.playerTwo, DOM.$boards[1], isP1);
    },

    handleBotResponse(gameControl) {
        this.updateTurnDisplay(gameControl.playerTwo.name);

        setTimeout(() => {
            if (!gameControl.gameActive) return;
            gameControl.handleAttack();
            boardView.render(gameControl.playerOne, DOM.$boards[0], false);
            const botWinnerMessage = gameControl.checkGameOver();
            if (botWinnerMessage) {
                soundManager.stopBGM();
                soundManager.playEffects('win');
                modalView.show(botWinnerMessage, 'win');
                return;
            }
            this.updateTurnDisplay(gameControl.playerOne.name);
            this.updateLabels(gameControl);
        }, 500);
    },

    updateLabels(gameControl) {
        DOM.$label1.classList.remove('is-hidden');
        DOM.$label2.classList.remove('is-hidden');

        if (gameControl.currentPlayer === gameControl.playerOne) {
            DOM.$label1.textContent = `${gameControl.playerOne.name} (Your Fleet)`;
            DOM.$label2.textContent = `${gameControl.playerTwo.name} (Target)`;
        } else {
            DOM.$label1.textContent = `${gameControl.playerOne.name} (Target)`;
            DOM.$label2.textContent = `${gameControl.playerTwo.name} (Your Fleet)`;
        }
    },
};
