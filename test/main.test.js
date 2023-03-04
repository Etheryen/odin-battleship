import { Ship, Gameboard, Player } from '../src/classes';

it('hits a ship', () => {
  const ship = new Ship(2);

  ship.hit();
  expect(ship.timesHit).toBe(1);
  ship.hit();
  expect(ship.timesHit).toBe(2);
});

it('sinks a ship', () => {
  const ship = new Ship(4);

  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

it('creates a board', () => {
  const gameboard = new Gameboard();

  expect(gameboard.board.length).toBe(10);

  for (let i = 0; i < 10; i++) {
    expect(gameboard.board[i].length).toBe(10);
    for (let j = 0; j < 10; j++) {
      expect(gameboard.board[i][j]).toBe(null);
    }
  }
});

it('parses coordinates', () => {
  expect(Gameboard.parseCoords(['C', 4])).toStrictEqual([3, 2]);
  expect(Gameboard.parseCoords(['J', 10])).toStrictEqual([9, 9]);
});

it('places a ship horizontally', () => {
  const gameboard = new Gameboard();

  const length = 3;
  const ship = new Ship(length);
  const [row, valueIndex] = Gameboard.parseCoords(['C', 4]);

  gameboard.placeShip(ship, [row, valueIndex]);

  for (let i = 0; i < length; i++) {
    expect(gameboard.board[row][valueIndex + i]).toStrictEqual(ship);
  }
});

it('places a ship vertically', () => {
  const gameboard = new Gameboard();

  const length = 5;
  const ship = new Ship(length);
  const [row, valueIndex] = Gameboard.parseCoords(['C', 4]);

  gameboard.placeShip(ship, [row, valueIndex], { vertical: true });

  for (let i = 0; i < length; i++) {
    expect(gameboard.board[row + i][valueIndex]).toStrictEqual(ship);
  }
});

it('all parts of the ship know it is it', () => {
  const gameboard = new Gameboard();

  const length = 5;
  const ship = new Ship(length);
  const [row, valueIndex] = Gameboard.parseCoords(['C', 4]);

  gameboard.placeShip(ship, [row, valueIndex], { vertical: true });

  gameboard.board[row][valueIndex].hit();

  for (let i = 0; i < length; i++) {
    expect(gameboard.board[row + i][valueIndex].timesHit).toStrictEqual(1);
  }
});

it('doesnt place ship illegally', () => {
  const gameboard = new Gameboard();

  const length = 3;
  const ship = new Ship(length);
  // placing ship that surpasses the edge
  const [row, valueIndex] = Gameboard.parseCoords(['I', 9]);

  let success = gameboard.placeShip(ship, [row, valueIndex]);

  expect(success).toBe(false);
  expect(gameboard.board[row][valueIndex]).toBe(null);

  success = gameboard.placeShip(ship, [row, valueIndex], { vertical: true });

  expect(success).toBe(false);
  expect(gameboard.board[row][valueIndex]).toBe(null);

  // placing ship that crosses another one vertically
  expect(
    gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['E', 5]))
  ).toBe(true);
  const previousBoard = gameboard.board.map((arr) => arr.slice());

  expect(
    gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['E', 2]), {
      vertical: true,
    })
  ).toBe(false);

  expect(
    gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['E', 3]), {
      vertical: true,
    })
  ).toBe(false);
  expect(
    gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['E', 4]), {
      vertical: true,
    })
  ).toBe(false);
  expect(
    gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['E', 5]), {
      vertical: true,
    })
  ).toBe(false);
  expect(previousBoard).toStrictEqual(gameboard.board);
  expect(
    gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['E', 1]), {
      vertical: true,
    })
  ).toBe(true);

  // placing ship that crosses another one horizontally
  expect(
    gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['B', 3]), {
      vertical: true,
    })
  ).toBe(true);
  expect(
    gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['A', 4]))
  ).toBe(false);
  expect(
    gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['B', 4]))
  ).toBe(false);
  expect(
    gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['D', 2]))
  ).toBe(false);
});

it('gameboard receives attack', () => {
  const gameboard = new Gameboard();

  const coords = Gameboard.parseCoords(['E', 5]);

  const ship = new Ship(4);
  gameboard.placeShip(ship, coords);
  expect(gameboard.receiveAttack(Gameboard.parseCoords(['F', 5]))).toBe(true);
  expect(gameboard.missedAttacks).toStrictEqual([]);
  expect(gameboard.ships).toStrictEqual([ship]);

  expect(gameboard.receiveAttack(Gameboard.parseCoords(['E', 6]))).toBe(false);
  expect(gameboard.missedAttacks).toStrictEqual([
    Gameboard.parseCoords(['E', 6]),
  ]);
});

it('gameboard reports all ships sunk', () => {
  const gameboard = new Gameboard();

  expect(
    gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['H', 10]))
  ).toBe(true);
  expect(
    gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['A', 1]), {
      vertical: true,
    })
  ).toBe(true);
  expect(gameboard.areShipsSunk()).toBe(false);
  gameboard.receiveAttack(Gameboard.parseCoords(['H', 10]));
  expect(gameboard.areShipsSunk()).toBe(false);
  gameboard.receiveAttack(Gameboard.parseCoords(['I', 10]));
  expect(gameboard.areShipsSunk()).toBe(false);
  gameboard.receiveAttack(Gameboard.parseCoords(['J', 10]));
  expect(gameboard.areShipsSunk()).toBe(false);
  gameboard.receiveAttack(Gameboard.parseCoords(['A', 2]));
  expect(gameboard.areShipsSunk()).toBe(false);
  gameboard.receiveAttack(Gameboard.parseCoords(['A', 1]));
  expect(gameboard.areShipsSunk()).toBe(true);
});

it('players can attack', () => {
  const p1 = new Player();
  const p2 = new Player();

  p1.attack(p2, Gameboard.parseCoords(['B', 2]));
  expect(p2.gameboard.missedAttacks).toStrictEqual([
    Gameboard.parseCoords(['B', 2]),
  ]);

  p2.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['C', 3]));
  p1.attack(p2, Gameboard.parseCoords(['C', 3]));
  expect(p2.gameboard.board[2][2].timesHit).toBe(1);
  p1.attack(p2, Gameboard.parseCoords(['D', 3]));
  expect(p2.gameboard.board[2][2].timesHit).toBe(2);
  expect(p2.gameboard.board[2][2].isSunk()).toBe(true);
  expect(p2.gameboard.areShipsSunk()).toBe(true);
});

it('computer attacks randomly', () => {
  for (let i = 0; i < 1000; i++) {
    let p1 = new Player();
    let p2 = new Player();

    p1.attackRandom(p2);
    expect(p2.gameboard.missedAttacks.length).toBe(1);
    let attack1 = p2.gameboard.missedAttacks.at(-1);
    p1.attackRandom(p2);
    let attack2 = p2.gameboard.missedAttacks.at(-1);
    expect(attack1).not.toStrictEqual(attack2);
  }
});

it('checks hit and missed attacks', () => {
  const p1 = new Player();
  const p2 = new Player();

  p2.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['B', 2]));

  expect(
    Gameboard.isAttackInArray(
      Gameboard.parseCoords(['B', 2]),
      p2.gameboard.missedAttacks
    )
  ).toBe(false);
  expect(
    Gameboard.isAttackInArray(
      Gameboard.parseCoords(['B', 2]),
      p2.gameboard.hitAttacks
    )
  ).toBe(false);

  p1.attack(p2, Gameboard.parseCoords(['C', 2]));

  expect(
    Gameboard.isAttackInArray(
      Gameboard.parseCoords(['C', 2]),
      p2.gameboard.missedAttacks
    )
  ).toBe(false);
  expect(
    Gameboard.isAttackInArray(
      Gameboard.parseCoords(['C', 2]),
      p2.gameboard.hitAttacks
    )
  ).toBe(true);

  p1.attack(p2, Gameboard.parseCoords(['C', 3]));

  expect(
    Gameboard.isAttackInArray(
      Gameboard.parseCoords(['C', 3]),
      p2.gameboard.missedAttacks
    )
  ).toBe(true);
  expect(
    Gameboard.isAttackInArray(
      Gameboard.parseCoords(['C', 3]),
      p2.gameboard.hitAttacks
    )
  ).toBe(false);
});
