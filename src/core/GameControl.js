export class GameControl {
    constructor(playerOne, playerTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.currentPlayer = this.playerOne;
        this.gameActive = false;
    }

    startGame() {
        this.currentPlayer = this.playerOne;
        this.gameActive = true;
    }

    handleAttack(x, y) {
        if (this.currentPlayer === this.playerOne) {
            this.playerOne.attack(this.playerTwo.gameboard, [x, y]);
            this.switchTurn();
            return;
        } else if (
            this.currentPlayer === this.playerTwo &&
            this.playerTwo.type === 'human'
        ) {
            this.playerTwo.attack(this.playerOne.gameboard, [x, y]);
            this.switchTurn();
            return;
        } else {
            const coords = this.playerTwo.attackBot(this.playerOne.gameboard);
            this.switchTurn();
            return coords;
        }
    }

    switchTurn() {
        this.currentPlayer =
            this.currentPlayer === this.playerOne
                ? this.playerTwo
                : this.playerOne;
    }

    checkGameOver() {
        const playerOneLost = this.playerOne.gameboard.allShipsSunk();
        const playerTwoLost = this.playerTwo.gameboard.allShipsSunk();

        if (playerOneLost) {
            this.gameActive = false;
            return `${this.playerTwo.name} Won!`;
        }

        if (playerTwoLost) {
            this.gameActive = false;
            return `${this.playerOne.name} Won!`;
        }
        return;
    }
}
