import { Gameboard } from './Gameboard.js';

export class Player {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.gameboard = new Gameboard(10, 10);
        this.lastHit = '';
        this.hitCluster = [];
        this.currentDirection = null;
        this.targetQueue = [];
    }

    attack(enemyBoard, coords) {
        enemyBoard.receiveAttack(coords);
    }

    attackBot(enemyBoard) {
        if (this.lastHit === '') return this.handleHunt(enemyBoard);
        if (this.currentDirection === null)
            return this.handleTarget(enemyBoard);

        return this.handleDestroy(enemyBoard);
    }

    getNextCoord(x, y, direction) {
        switch (direction) {
            case 'UP':
                return [x, y - 1];
            case 'RIGHT':
                return [x + 1, y];
            case 'LEFT':
                return [x - 1, y];
            case 'DOWN':
                return [x, y + 1];
        }
    }

    isOutOfBounds(x, y, enemyBoard) {
        return x < 1 || x > enemyBoard.width || y < 1 || y > enemyBoard.height;
    }

    resetState() {
        this.lastHit = '';
        this.hitCluster = [];
        this.currentDirection = null;
        this.targetQueue = [];
    }

    handleHunt(enemyBoard) {
        const x = Math.floor(Math.random() * enemyBoard.width) + 1;
        const y = Math.floor(Math.random() * enemyBoard.height) + 1;
        enemyBoard.receiveAttack([x, y]);

        if (enemyBoard.shipCells.has(`${x},${y}`)) {
            this.lastHit = `${x},${y}`;
            this.hitCluster.push(`${x},${y}`);
            this.targetQueue.push('UP', 'RIGHT', 'LEFT', 'DOWN');
        }
    }

    handleTarget(enemyBoard) {
        const [x, y] = this.lastHit.split(',').map(Number);
        let direction = this.targetQueue[0];
        const [nx, ny] = this.getNextCoord(x, y, direction);

        if (this.isOutOfBounds(nx, ny, enemyBoard)) {
            this.targetQueue.shift();
            return this.handleTarget(enemyBoard);
        }

        if (enemyBoard.firedShots.has(`${nx},${ny}`)) {
            this.targetQueue.shift();
            return this.handleTarget(enemyBoard);
        }

        enemyBoard.receiveAttack([nx, ny]);

        if (enemyBoard.shipCells.has(`${nx},${ny}`)) {
            this.lastHit = `${nx},${ny}`;
            this.currentDirection = direction;
            this.hitCluster.push(`${nx},${ny}`);
            return;
        }

        this.targetQueue.shift();
        if (this.targetQueue.length === 0) return this.resetState();
    }

    handleDestroy(enemyBoard) {
        const [x, y] = this.lastHit.split(',').map(Number);
        const direction = this.currentDirection;
        const [nx, ny] = this.getNextCoord(x, y, direction);

        if (this.isOutOfBounds(nx, ny, enemyBoard)) {
            this.currentDirection = null;
            return this.handleTarget(enemyBoard);
        }

        if (enemyBoard.firedShots.has(`${nx},${ny}`)) {
            this.currentDirection = null;
            return this.handleTarget(enemyBoard);
        }

        enemyBoard.receiveAttack([nx, ny]);

        if (enemyBoard.shipCells.has(`${nx},${ny}`)) {
            this.lastHit = `${nx},${ny}`;
            this.hitCluster.push(`${nx},${ny}`);

            const ship = enemyBoard.shipCells.get(`${nx},${ny}`);
            if (ship.isSunk()) this.resetState();
            return;
        }
        this.currentDirection = null;
    }
}
