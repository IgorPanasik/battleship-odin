export const boardView = {
    render(player, boardElement, isEnemy = false) {
        boardElement.textContent = '';

        for (let x = 0; x < player.gameboard.height; x++) {
            for (let y = 0; y < player.gameboard.width; y++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;

                const coord = `${x},${y}`;
                const ship = player.gameboard.shipCells.get(coord);

                if (ship && !isEnemy) {
                    cell.classList.add('ship', 'is-ship-placed');
                    cell.textContent = 'X';
                }

                if (player.gameboard.firedShots.has(coord)) {
                    cell.classList.add('cell--fired');

                    if (ship) {
                        cell.classList.add('hit');
                        cell.textContent = 'K';
                    } else {
                        cell.classList.add('miss');
                        cell.textContent = '•';
                    }
                }
                boardElement.appendChild(cell);
            }
        }
    },
};
