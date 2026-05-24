import { Ship } from '../core/Ship.js';

describe('Ship', () => {
    test('initializes with given length', () => {
        const ship = new Ship(3);

        const length =
            ship.lengthShip !== undefined ? ship.lengthShip : ship.length;
        expect(length).toBe(3);
    });

    test('new ship starts with 0 hits and is not sunk', () => {
        const ship = new Ship(3);
        const hits = ship.countHits !== undefined ? ship.countHits : ship.hits;
        expect(hits).toBe(0);
        expect(ship.isSunk()).toBe(false);
    });

    test('hit() increases countHits', () => {
        const ship = new Ship(3);
        ship.hit();
        const hits = ship.countHits !== undefined ? ship.countHits : ship.hits;
        expect(hits).toBe(1);
    });

    test('isSunk() returns true when hits equal length', () => {
        const ship = new Ship(3);
        const length =
            ship.lengthShip !== undefined ? ship.lengthShip : ship.length;

        for (let i = 0; i < length; i++) {
            ship.hit();
        }

        const hits = ship.countHits !== undefined ? ship.countHits : ship.hits;
        expect(hits).toBe(3);
        expect(ship.isSunk()).toBe(true);
    });
});
