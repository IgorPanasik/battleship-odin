import { GameControl } from '../services/GameControl.js';

describe('GameControl', () => {
    let gc;

    beforeEach(() => {
        gc = new GameControl();
    });

    test('initializes with playerOne as current player', () => {
        expect(gc.currentPlayer).toBe(gc.playerOne);
        expect(gc.gameActive).toBe(false);
    });

    test('startGame sets gameActive to true', () => {
        gc.startGame();
        expect(gc.gameActive).toBe(true);
    });

    test('switchTurn toggles between players', () => {
        gc.switchTurn();
        expect(gc.currentPlayer).toBe(gc.playerTwo);
        gc.switchTurn();
        expect(gc.currentPlayer).toBe(gc.playerOne);
    });

    test('handleAttack switches turn after human move', () => {
        const spy = jest.spyOn(gc.playerTwo.gameboard, 'receiveAttack');

        gc.handleAttack(2, 2);
        expect(spy).toHaveBeenCalledWith([2, 2]);
        expect(gc.currentPlayer).toBe(gc.playerTwo);
    });

    test('handleAttack triggers bot attack when it is bot turn', () => {
        gc.currentPlayer = gc.playerTwo;
        const botSpy = jest
            .spyOn(gc.playerTwo, 'attackBot')
            .mockReturnValue([5, 5]);

        const coords = gc.handleAttack();

        expect(botSpy).toHaveBeenCalled();
        expect(coords).toEqual([5, 5]);
        expect(gc.currentPlayer).toBe(gc.playerOne);
    });

    test('checkGameOver returns correct winner and stops game', () => {
        gc.startGame();

        jest.spyOn(gc.playerOne.gameboard, 'allShipsSunk').mockReturnValue(
            false
        );
        jest.spyOn(gc.playerTwo.gameboard, 'allShipsSunk').mockReturnValue(
            true
        );

        const result = gc.checkGameOver();
        expect(result).toBe('player1 Won!');
        expect(gc.gameActive).toBe(false);
    });
});
