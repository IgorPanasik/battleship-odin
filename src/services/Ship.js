export class Ship {
    constructor(lengthShip) {
        this.lengthShip = lengthShip;
        this.countHits = 0;
    }

    hit() {
        if (this.countHits < this.lengthShip) {
            this.countHits++;
        }
    }

    isSunk() {
        return this.countHits >= this.lengthShip;
    }
}
