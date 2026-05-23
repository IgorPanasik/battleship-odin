export const directionShip = (e) => {
    const turnOver = e.target.closest('.js-turn-over');

    if (turnOver && turnOver.style.pointerEvents === 'none') return;

    if (turnOver) {
        const shipText = turnOver.previousElementSibling;

        if (shipText && shipText.classList.contains('js-ship-text')) {
            const newDirection =
                shipText.dataset.direction === 'horizontal'
                    ? 'vertical'
                    : 'horizontal';

            shipText.dataset.direction = newDirection;
        }
    }
};
