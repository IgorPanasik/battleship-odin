import { Ship } from '../services/Ship';

describe('Ship', () => {
    test('initializes with given length', () => {
        const ship = new Ship(3);
        expect(ship.lengthShip).toBe(3);
    });

    test('new ship starts with 0 hits and is not sunk', () => {
        const ship = new Ship(3);
        expect(ship.countHits).toBe(0);
        expect(ship.isSunk()).toBe(false);
    });

    test('hit() increases countHits', () => {
        const ship = new Ship(3);
        ship.hit();
        expect(ship.countHits).toBe(1);
    });

    test('isSunk() returns true when hits equal length', () => {
        const ship = new Ship(3);
        [...Array(ship.lengthShip)].forEach(() => ship.hit());
        expect(ship.countHits).toBe(3);
        expect(ship.isSunk()).toBe(true);
    });
});
