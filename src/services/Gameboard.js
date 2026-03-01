import { Ship } from './Ship.js';

export class Gameboard {
    constructor(width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.ships = [];
        this.shipCells = new Map();
        this.missedHits = new Set();
        this.firedShots = new Set();
    }
    // placing ships on the board by coordinates
    placeShips(shipLength, [x, y], direction) {
        const ship = new Ship(shipLength);
        const shipCoords = [];

        for (let i = 0; i < shipLength; i++) {
            const cx = direction === 'horizontal' ? x + i : x;
            const cy = direction === 'vertical' ? y + i : y;
            shipCoords.push(`${cx},${cy}`);
        }

        // checking for board overflow
        for (let cell of shipCoords) {
            const [cellX, cellY] = cell.split(',').map(Number);

            if (
                cellX < 0 ||
                cellX >= this.width ||
                cellY < 0 ||
                cellY >= this.height
            )
                throw new Error('Ship goes out of bounds');
        }
        // checking the crossing of ships
        for (let cell of shipCoords) {
            if (this.shipCells.has(cell))
                throw new Error('Ships cannot overlap');
        }

        for (let cell of shipCoords) {
            this.shipCells.set(cell, ship);
        }
        this.ships.push(ship);
    }

    receiveAttack([x, y]) {
        const cellKey = `${x},${y}`;
        this.firedShots.add(cellKey);
        if (this.shipCells.has(cellKey)) {
            this.shipCells.get(cellKey).hit();
        } else {
            this.missedHits.add(cellKey);
        }
    }

    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }

    resetBoard() {
        this.ships = [];
        this.shipCells = new Map();
        this.missedHits = new Set();
        this.firedShots = new Set();
    }
}
