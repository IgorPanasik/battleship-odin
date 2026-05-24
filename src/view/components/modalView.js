import { DOM } from '../domElements.js';

export const modalView = {
    show(name, type = 'start') {
        const title = DOM.$modalStartGame.querySelector('.js-modal-title');
        const turnInfo = DOM.$modalStartGame.querySelector(
            '.js-modal-turn-info'
        );
        const turnText = DOM.$modalStartGame.querySelector(
            '.js-modal-turn-text'
        );
        const nameSpan = DOM.$modalStartGame.querySelector(
            '.js-modal-player-name'
        );

        if (type === 'win') {
            if (turnInfo) turnInfo.classList.add('is-hidden');
            const isBotWin =
                name.toLowerCase().includes('computer') ||
                name.toLowerCase().includes('bot');
            if (isBotWin) {
                if (title) title.textContent = `🤖 AI Victory! 🏴‍☠️ ${name}`;
            } else {
                if (title) title.textContent = `🏆 Victory! 🎉 ${name}`;
            }
        } else if (type === 'turn') {
            if (title) title.textContent = '⏳ Next Turn! 🔄';
            if (turnInfo) turnInfo.classList.remove('is-hidden');
            if (turnText) turnText.textContent = 'It is the turn of: ';
            if (nameSpan) nameSpan.textContent = name;
        } else {
            if (title) title.textContent = '⚓ The game has begun! 🗺️';
            if (turnInfo) turnInfo.classList.remove('is-hidden');
            if (turnText)
                turnText.textContent = 'The first move is made by the: ';
            if (nameSpan) nameSpan.textContent = name;
        }

        DOM.$modalStartGame.classList.remove('is-hidden');
    },

    init() {
        DOM.$modalCloseBtn.addEventListener('click', () => {
            DOM.$modalStartGame.classList.add('is-hidden');
        });
    },
};
