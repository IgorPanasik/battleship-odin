import { DOM } from '../dom/dom.js';

export const restartToMenu = () => {
    DOM.$restartBtn.classList.add('is-hidden');
    DOM.$turnDisplay.classList.add('is-hidden');

    DOM.$form.classList.remove('is-hidden');
    DOM.$form.reset();

    DOM.$boards.forEach((board) => {
        board.textContent = '';
        board.parentElement.classList.add('is-hidden');
    });
};
