import { Ship, Gameboard, Player, prettyPrintBoard } from '../src/js/classes';

function isArrayInArray(arr, item) {
  return arr.some((ele) => JSON.stringify(ele) === JSON.stringify(item));
}

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

it('all parts of the ship know it is hit', () => {
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
    gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['E', 1]), {
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
  expect(
    isArrayInArray(gameboard.missedAttacks, Gameboard.parseCoords(['F', 5]))
  ).toBe(false);
  expect(gameboard.ships).toStrictEqual([ship]);

  expect(gameboard.receiveAttack(Gameboard.parseCoords(['E', 6]))).toBe(false);
  expect(
    isArrayInArray(gameboard.missedAttacks, Gameboard.parseCoords(['E', 6]))
  ).toBe(true);
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
  expect(
    isArrayInArray(p2.gameboard.missedAttacks, Gameboard.parseCoords(['B', 2]))
  ).toBe(true);

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

it('checks placement of a new ship', () => {
  const board = new Gameboard();

  expect(
    board.canPlaceShip(new Ship(3), Gameboard.parseCoords(['B', '2']))
  ).toBe(true);
  board.placeShip(new Ship(3), Gameboard.parseCoords(['B', '2']));

  expect(
    board.canPlaceShip(new Ship(3), Gameboard.parseCoords(['B', '1']), {
      vertical: true,
    })
  ).toBe(false);
  expect(
    board.canPlaceShip(new Ship(3), Gameboard.parseCoords(['C', '1']), {
      vertical: true,
    })
  ).toBe(false);
  expect(
    board.canPlaceShip(new Ship(3), Gameboard.parseCoords(['D', '1']), {
      vertical: true,
    })
  ).toBe(false);

  board.placeShip(new Ship(5), Gameboard.parseCoords(['I', 2]), {
    vertical: true,
  });

  expect(
    board.canPlaceShip(new Ship(3), Gameboard.parseCoords(['G', '4']))
  ).toBe(false);
});

it('cant place ships too close', () => {
  const board = new Gameboard();

  board.placeShip(new Ship(3), Gameboard.parseCoords(['C', '4']));

  expect(
    board.canPlaceShip(new Ship(2), Gameboard.parseCoords(['A', '1']), {
      vertical: true,
    })
  ).toBe(true);

  expect(
    board.canPlaceShip(new Ship(2), Gameboard.parseCoords(['B', '1']), {
      vertical: true,
    })
  ).toBe(true);

  expect(
    board.canPlaceShip(new Ship(2), Gameboard.parseCoords(['B', '2']), {
      vertical: true,
    })
  ).toBe(false);

  expect(
    board.canPlaceShip(new Ship(2), Gameboard.parseCoords(['J', '1']), {
      vertical: true,
    })
  ).toBe(true);

  expect(
    board.canPlaceShip(new Ship(2), Gameboard.parseCoords(['J', '9']), {
      vertical: true,
    })
  ).toBe(true);

  expect(
    board.canPlaceShip(new Ship(2), Gameboard.parseCoords(['A', '9']), {
      vertical: true,
    })
  ).toBe(true);
});

it('returns squares covered by a new ship', () => {
  const board = new Gameboard();

  let ship = new Ship(3);
  let coords = Gameboard.parseCoords(['B', '2']);
  expect(board.getSquaresCoveredByNewShip(ship, coords)).toStrictEqual([
    [1, 1],
    [1, 2],
    [1, 3],
  ]);
  expect(
    board.getSquaresCoveredByNewShip(ship, coords, { vertical: true })
  ).toStrictEqual([
    [1, 1],
    [2, 1],
    [3, 1],
  ]);

  ship = new Ship(4);
  coords = Gameboard.parseCoords(['H', '8']);
  expect(board.getSquaresCoveredByNewShip(ship, coords)).toStrictEqual([
    [7, 7],
    [7, 8],
    [7, 9],
  ]);
  expect(
    board.getSquaresCoveredByNewShip(ship, coords, { vertical: true })
  ).toStrictEqual([
    [7, 7],
    [8, 7],
    [9, 7],
  ]);

  coords = Gameboard.parseCoords(['J', '7']);
  expect(
    board.getSquaresCoveredByNewShip(ship, coords, { vertical: true })
  ).toStrictEqual([
    [6, 9],
    [7, 9],
    [8, 9],
    [9, 9],
  ]);
});

it('gets next ship length to place', () => {
  const g = new Gameboard();

  expect(g.getNextShipLengthToPlace()).toBe(4);
  g.placeShip(new Ship(4), Gameboard.parseCoords(['A', 1]));
  expect(g.getNextShipLengthToPlace()).toBe(3);
  g.placeShip(new Ship(3), Gameboard.parseCoords(['A', 3]));
  expect(g.getNextShipLengthToPlace()).toBe(3);
  g.placeShip(new Ship(3), Gameboard.parseCoords(['A', 5]));
  expect(g.getNextShipLengthToPlace()).toBe(2);
  g.placeShip(new Ship(2), Gameboard.parseCoords(['A', 7]));
  expect(g.getNextShipLengthToPlace()).toBe(2);
  g.placeShip(new Ship(2), Gameboard.parseCoords(['A', 9]));
  expect(g.getNextShipLengthToPlace()).toBe(2);
  g.placeShip(new Ship(2), Gameboard.parseCoords(['F', 1]));
  expect(g.getNextShipLengthToPlace()).toBe(1);
  g.placeShip(new Ship(1), Gameboard.parseCoords(['J', 1]));
  expect(g.getNextShipLengthToPlace()).toBe(1);
  g.placeShip(new Ship(1), Gameboard.parseCoords(['J', 3]));
  expect(g.getNextShipLengthToPlace()).toBe(1);
  g.placeShip(new Ship(1), Gameboard.parseCoords(['J', 5]));
  expect(g.getNextShipLengthToPlace()).toBe(1);
  g.placeShip(new Ship(1), Gameboard.parseCoords(['J', 7]));
  expect(g.getNextShipLengthToPlace()).toBeUndefined();
});

it('finds all squares covered by a ship', () => {
  const g = new Gameboard();

  g.placeShip(new Ship(4), Gameboard.parseCoords(['B', '2']));
  expect(
    g.findAllShipSquares(4, Gameboard.parseCoords(['B', '2']))
  ).toStrictEqual([
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
  ]);
});

it('adds adjacent squares to queue', () => {
  const g = new Gameboard();

  g.addAdjacentSquaresToQueue([1, 1]);
  expect(g.possibleHitsQueue).toStrictEqual([
    [0, 1],
    [1, 2],
    [2, 1],
    [1, 0],
  ]);

  g.possibleHitsQueue = [];
  g.addAdjacentSquaresToQueue([0, 1]);
  expect(g.possibleHitsQueue).toStrictEqual([
    [0, 2],
    [1, 1],
    [0, 0],
  ]);

  g.possibleHitsQueue = [];
  g.addAdjacentSquaresToQueue([9, 9]);
  expect(g.possibleHitsQueue).toStrictEqual([
    [8, 9],
    [9, 8],
  ]);
});
