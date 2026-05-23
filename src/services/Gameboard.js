import { Ship } from './Ship.js';

export class Gameboard {
    constructor(width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.SHIP_LIMITS = { 4: 1, 3: 2, 2: 3, 1: 4 };
        this.placedCount = { 4: 0, 3: 0, 2: 0, 1: 0 };
        this.ships = [];
        this.currentDraggedShip = null;
        this.shipCells = new Map();
        this.missedHits = new Set();
        this.firedShots = new Set();
    }

    allShipsPlaced() {
        return Object.keys(this.SHIP_LIMITS).every(
            (size) => this.placedCount[size] === this.SHIP_LIMITS[size]
        );
    }

    hasAnyShips() {
        return Object.values(this.placedCount).some((count) => count > 0);
    }

    coordKey(x, y) {
        return `${x},${y}`;
    }

    inBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    canPlace(candidate) {
        for (const key of candidate) {
            if (this.shipCells.has(key)) return false;
            const [x, y] = key.split(',').map(Number);

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (!this.inBounds(nx, ny)) continue;
                    if (this.shipCells.has(this.coordKey(nx, ny))) return false;
                }
            }
        }
        return true;
    }

    setShip(candidate) {
        const ship = new Ship(candidate.length);
        this.ships.push(ship);
        for (const key of candidate) this.shipCells.set(key, ship);
        return ship;
    }

    // placing ships on the board by coordinates
    placeShips(length, [x, y], direction) {
        if (this.placedCount[length] >= this.SHIP_LIMITS[length]) {
            throw new Error(`No ships of size ${length} left`);
        }

        const candidate = [];

        for (let i = 0; i < length; i++) {
            const cx = direction === 'horizontal' ? x : x + i;
            const cy = direction === 'horizontal' ? y + i : y;
            if (!this.inBounds(cx, cy))
                throw new Error('Ship goes out of bounds');
            candidate.push(this.coordKey(cx, cy));
        }

        if (!this.canPlace(candidate))
            throw new Error('Cannot place ship here');
        this.setShip(candidate);
        this.placedCount[length]++;
        return true;
    }

    placeRandomShip(length) {
        const randInt = (max) => Math.floor(Math.random() * max);

        let placed = false;
        let attempts = 0;

        while (!placed) {
            attempts++;

            if (attempts > 1000) return;

            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

            const startX = randInt(this.width);
            const startY = randInt(this.height);

            try {
                this.placeShips(length, [startX, startY], direction);
                return; // if it's success;
            } catch (error) {
                continue;
            }
        }
        throw new Error(
            `Recursion: Unable to create reference to ship of size. ${length}`
        );
    }

    placeAllShipsRandomly() {
        this.resetBoard();

        const size = Object.keys(this.SHIP_LIMITS)
            .map(Number)
            .sort((a, b) => a - b);

        for (const length of size) {
            const count = this.SHIP_LIMITS[length];
            for (let i = 0; i < count; i++) {
                this.placeRandomShip(length);
            }
        }
    }

    receiveAttack([x, y]) {
        const key = this.coordKey(x, y);
        this.firedShots.add(key);
        if (this.shipCells.has(key)) {
            this.shipCells.get(key).hit();
        } else {
            this.missedHits.add(key);
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
        this.placedCount = { 4: 0, 3: 0, 2: 0, 1: 0 };
    }
}
