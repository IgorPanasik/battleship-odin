import { Gameboard } from '../services/Gameboard';
import { Player } from '../services/Player';

describe('player', () => {
    let playerHuman;
    let playerBot;
    beforeEach(() => {
        playerHuman = new Player('user', 'human');
        playerBot = new Player('bot', 'bot');
    });

    // --- Initialization ------------------------------------------------------
    test('initializes with correct name/type/gameboard', () => {
        expect(playerHuman.name).toBe('user');
        expect(playerHuman.type).toBe('human');
        expect(playerBot.type).toBe('bot');
        expect(playerHuman.gameboard).toBeInstanceOf(Gameboard);
    });
    // --- Moves human/bot ------------------------------------------------------
    test('human attack calls enemyBoard.receiveAttack', () => {
        const mockBoard = { receiveAttack: jest.fn() };
        playerHuman.attack(mockBoard, [3, 4]);
        expect(mockBoard.receiveAttack).toHaveBeenCalledWith([3, 4]);
    });

    // ---------------- HUNT ----------------
    test('bot enters TARGET after a hit in HUNT mode', () => {
        const mockShip = { hit: jest.fn(), isSunk: () => false };
        const mockBoard = {
            width: 10,
            height: 10,
            firedShots: new Set(),
            shipCells: new Map([['5,5', mockShip]]),
            receiveAttack: jest.fn((coords) => {
                mockBoard.firedShots.add(coords.join(','));
            }),
        };
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
        playerBot.attackBot(mockBoard);
        expect(playerBot.lastHit).toBe('5,5');
        expect(playerBot.targetQueue.length).toBe(4);
        expect(playerBot.currentDirection).toBe(null);
        Math.random.mockRestore();
    });

    // check to miss
    test('bot does NOT update state after a MISS in HUNT mode', () => {
        const mockShip = { hit: jest.fn(), isSunk: () => false };
        jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
        const mockBoard = {
            width: 10,
            height: 10,
            firedShots: new Set(),
            shipCells: new Map([['5,5', mockShip]]),
            receiveAttack: jest.fn((coords) => {
                mockBoard.firedShots.add(coords.join(','));
            }),
        };
        playerBot.attackBot(mockBoard);

        expect(playerBot.lastHit).toBe('');
        expect(playerBot.targetQueue.length).toBe(0);
    });

    // ---------------- TARGET ----------------
    test('bot chooses next direction in TARGET mode', () => {
        playerBot.lastHit = '5,5';
        playerBot.targetQueue = ['UP', 'RIGHT', 'LEFT', 'DOWN'];
        const mockBoard = {
            width: 10,
            height: 10,
            firedShots: new Set(['5,4']),
            shipCells: new Map(),
            receiveAttack: jest.fn((coords) => {
                mockBoard.firedShots.add(coords.join(','));
            }),
        };
        playerBot.attackBot(mockBoard);
        expect(mockBoard.receiveAttack).toHaveBeenCalledWith([6, 5]);
    });

    // ---------------- DESTROY ----------------
    test('bot continues attacking in DESTROY mode and resets after sinking', () => {
        let hitCount = 1;
        const mockShip = {
            hit: jest.fn(() => hitCount++),
            isSunk: jest.fn(() => hitCount >= 3),
        };

        const mockBoard = {
            width: 10,
            height: 10,
            firedShots: new Set(),
            shipCells: new Map([
                ['5,5', mockShip],
                ['6,5', mockShip],
                ['7,5', mockShip],
            ]),
            receiveAttack: jest.fn((coords) => {
                const key = coords.join(',');
                if (mockBoard.shipCells.has(key)) {
                    mockShip.hit();
                }
                mockBoard.firedShots.add(key);
            }),
        };

        playerBot.lastHit = '5,5';
        playerBot.currentDirection = 'RIGHT';
        playerBot.targetQueue = [];

        playerBot.attackBot(mockBoard);
        expect(playerBot.lastHit).toBe('6,5');

        jest.spyOn(global.Math, 'random').mockReturnValue(0.99);

        playerBot.attackBot(mockBoard);

        expect(playerBot.lastHit).toBe('');
        expect(playerBot.currentDirection).toBe(null);
        expect(playerBot.targetQueue.length).toBe(0);
        expect(playerBot.hitCluster.length).toBe(0);

        Math.random.mockRestore();
    });
});
