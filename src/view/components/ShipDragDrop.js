import { boardView } from './boardView.js';

export class ShipDragDrop {
    constructor(player, boardElement, replaceShipsElements) {
        this.player = player;
        this.boardElement = boardElement;
        this.replaceShipsElements = replaceShipsElements;
        this.draggedShip = null;
        this.draggedShipSize = null;
        this.draggedShipDirection = null;
        this.onStateChanged = null;
        this.isDragging = false;
        this.ghostElement = null;
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
    }

    init() {
        this.setupShipMouseListeners();
    }

    setupShipMouseListeners() {
        const shipTexts =
            this.replaceShipsElements.querySelectorAll('.js-ship-text');

        shipTexts.forEach((shipText) => {
            shipText.addEventListener('mousedown', (e) => {
                this.handleShipMouseDown(e);
            });
        });
    }

    handleShipMouseDown(e) {
        if (e.button !== 0) return;

        const shipText = e.target;

        if (shipText.style.pointerEvents === 'none') return;

        this.draggedShip = shipText;
        this.draggedShipSize = Number(shipText.dataset.size);
        this.draggedShipDirection = shipText.dataset.direction;
        this.isDragging = true;

        this.createGhostElement();

        document.addEventListener('mousemove', this.boundMouseMove);
        document.addEventListener('mouseup', this.boundMouseUp);
    }

    createGhostElement() {
        const dragImage = this.draggedShip.cloneNode(true);

        const computedStyle = window.getComputedStyle(this.draggedShip);

        for (let i = 0; i < computedStyle.length; i++) {
            const property = computedStyle[i];
            dragImage.style.setProperty(
                property,
                computedStyle.getPropertyValue(property)
            );
        }

        dragImage.style.position = 'fixed';
        dragImage.style.pointerEvents = 'none';
        dragImage.style.zIndex = '1000';
        dragImage.style.transition = 'none';

        document.body.appendChild(dragImage);
        this.ghostElement = dragImage;
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.ghostElement) return;

        this.ghostElement.style.left = e.clientX - 15 + 'px';
        this.ghostElement.style.top = e.clientY - 15 + 'px';

        const cell = document
            .elementFromPoint(e.clientX, e.clientY)
            ?.closest('.cell');

        if (cell && cell.closest('.board') === this.boardElement) {
            const x = Number(cell.dataset.x);
            const y = Number(cell.dataset.y);

            this.showBoardPreview(x, y);
        } else {
            this.clearBoardPreview();
        }
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        document.removeEventListener('mousemove', this.boundMouseMove);
        document.removeEventListener('mouseup', this.boundMouseUp);

        if (this.ghostElement) {
            this.ghostElement.remove();
            this.ghostElement = null;
        }

        const cell = document
            .elementFromPoint(e.clientX, e.clientY)
            ?.closest('.cell');

        if (cell && cell.closest('.board') === this.boardElement) {
            const x = Number(cell.dataset.x);
            const y = Number(cell.dataset.y);
            this.handleDrop(x, y);
        } else {
            this.clearBoardPreview();
        }
        this.draggedShip = null;
    }

    handleDrop(x, y) {
        const direction =
            this.draggedShipDirection === 'vertical'
                ? 'vertical'
                : 'horizontal';

        try {
            this.player.gameboard.placeShips(
                this.draggedShipSize,
                [x, y],
                direction
            );
            boardView.render(this.player, this.boardElement);

            this.updateShipButton(this.draggedShipSize);
            if (typeof this.onStateChanged === 'function') {
                this.onStateChanged();
            }

            this.clearBoardPreview();
        } catch (error) {
            console.error(error.message);
        } finally {
            this.clearBoardPreview();
        }
    }

    showBoardPreview(x, y) {
        this.clearBoardPreview();

        const direction =
            this.draggedShipDirection === 'vertical'
                ? 'vertical'
                : 'horizontal';

        const cellKeys = this.getShipCells(
            x,
            y,
            this.draggedShipSize,
            direction
        );

        if (!cellKeys) return;

        const canPlace = this.player.gameboard.canPlace(cellKeys);

        cellKeys.forEach((key) => {
            const [cx, cy] = key.split(',').map(Number);
            const cell = this.boardElement.querySelector(
                `[data-x="${cx}"][data-y="${cy}"]`
            );
            if (cell) {
                cell.classList.add('cell--preview');
                if (canPlace) {
                    cell.classList.add('cell--valid');
                } else {
                    cell.classList.add('cell--invalid');
                }
            }
        });
    }

    clearBoardPreview() {
        const cells = this.boardElement.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.classList.remove(
                'cell--preview',
                'cell--valid',
                'cell--invalid'
            );
        });
    }

    getShipCells(x, y, size, direction) {
        const cells = [];

        for (let i = 0; i < size; i++) {
            const cx = direction === 'horizontal' ? x : x + i;
            const cy = direction === 'horizontal' ? y + i : y;

            if (!this.player.gameboard.inBounds(cx, cy)) {
                return null;
            }

            cells.push(this.player.gameboard.coordKey(cx, cy));
        }
        return cells.length === size ? cells : null;
    }

    updateShipButton(size) {
        const shipItem = this.replaceShipsElements.querySelector(
            `.js-ship-text[data-size="${size}"]`
        );

        if (shipItem) {
            const currentCount = Number(shipItem.dataset.count);
            if (currentCount > 1) {
                shipItem.dataset.count = currentCount - 1;
            } else {
                shipItem.dataset.count = 0;
                shipItem.classList.add('is-disabled');
                this.toggleRotateShipBtn(shipItem, false);
            }
        }
    }

    toggleRotateShipBtn(shipItem, isVisible) {
        const turnOverBtn = shipItem.nextElementSibling;

        if (!turnOverBtn || !turnOverBtn.classList.contains('js-turn-over'))
            return;
        if (isVisible) {
            turnOverBtn.classList.remove('is-hidden');
        } else {
            turnOverBtn.classList.add('is-hidden');
        }
    }

    updateShipButtons() {
        const shipItems =
            this.replaceShipsElements.querySelectorAll('.js-ship-text');
        shipItems.forEach((shipText) => {
            shipText.classList.add('is-disabled');
            shipText.dataset.count = '0';
            this.toggleRotateShipBtn(shipText, false);
        });
    }
}
