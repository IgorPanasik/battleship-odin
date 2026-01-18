import { Gameboard } from '../services/Gameboard';

describe('board', () => {
    let board;
    beforeEach(() => {
        board = new Gameboard(10, 10);
    });

    // --- Initialization ------------------------------------------------------
    test('initializes with correct empty state', () => {
        expect(board.width).toBe(10);
        expect(board.height).toBe(10);
        expect(board.ships).toEqual([]);
        expect(board.shipCells.size).toBe(0);
        expect(board.missedHits.size).toBe(0);
    });

    // --- Ship placement ------------------------------------------------------
    test('places a ship horizontally at correct coordinates', () => {
        board.placeShips(3, [2, 3], 'horizontal');
        const keys = [...board.shipCells.keys()];
        expect(keys).toEqual(['2,3', '3,3', '4,3']);
        expect(board.ships.length).toEqual(1);
    });

    test('throws when placing a ship that overlaps another', () => {
        board.placeShips(3, [2, 3], 'horizontal');
        expect(() => board.placeShips(3, [2, 3], 'horizontal')).toThrow(
            'Ships cannot overlap'
        );
    });

    test('throws when placing a ship out of bounds', () => {
        expect(() => board.placeShips(3, [10, 3], 'horizontal')).toThrow(
            'Ship goes out of bounds'
        );
    });

    test('places a ship vertically at correct coordinates', () => {
        board.placeShips(4, [5, 3], 'vertical');
        const keys = [...board.shipCells.keys()];
        expect(keys).toEqual(['5,3', '5,4', '5,5', '5,6']);
    });

    // --- Attacks -------------------------------------------------------------
    test('registers a hit on a ship', () => {
        board.placeShips(2, [5, 5], 'vertical');
        board.receiveAttack([5, 5]);
        expect(board.ships[0].countHits).toBe(1);
    });

    test('registers a miss when attacking empty cell', () => {
        board.receiveAttack([7, 7]);
        expect(board.missedHits.size).toBe(1);
        expect(board.missedHits.has('7,7')).toBe(true);
    });

    // --- Sinking -------------------------------------------------------------
    test('allShipsSunk returns false when ships remain', () => {
        board.placeShips(2, [5, 5], 'vertical');
        board.receiveAttack([5, 5]);
        expect(board.allShipsSunk()).toBe(false);
    });

    test('allShipsSunk returns true when all ships are sunk', () => {
        board.placeShips(3, [2, 3], 'horizontal');
        board.placeShips(2, [5, 5], 'vertical');

        // sink first ship
        board.receiveAttack([2, 3]);
        board.receiveAttack([3, 3]);
        board.receiveAttack([4, 3]);

        // sink second ship
        board.receiveAttack([5, 5]);
        board.receiveAttack([5, 6]);

        expect(board.allShipsSunk()).toBe(true);
    });
});
