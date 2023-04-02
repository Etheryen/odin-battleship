function isArrayInArray(arr, item) {
  return arr.some((ele) => JSON.stringify(ele) === JSON.stringify(item));
}

class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
  }

  hit() {
    this.timesHit++;
  }

  isSunk() {
    return this.timesHit >= this.length;
  }
}

class Gameboard {
  constructor() {
    this.board = Gameboard.createBoard();
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];
    this.possibleHitsQueue = [];
  }

  static createBoard() {
    const result = [];

    for (let i = 0; i < 10; i++) {
      let row = [];
      for (let j = 0; j < 10; j++) {
        row.push(null);
      }
      result.push(row);
    }

    return result;
  }

  static parseCoords(coords) {
    const dict = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9 };

    let [x, y] = coords;
    x = x.toUpperCase();

    if (!(x in dict) || y < 1 || y > 10) return;

    return [y - 1, dict[x]];
  }

  static isAttackInArray(coords, array) {
    for (const item of array) {
      if (item[0] === coords[0] && item[1] === coords[1]) return true;
    }
    return false;
  }

  placeShip(ship, coords, options = { vertical: false }) {
    const [row, valueIndex] = coords;

    if (!this.canPlaceShip(ship, coords, options)) return false;

    for (let i = 0; i < ship.length; i++) {
      if (options.vertical) this.board[row + i][valueIndex] = ship;
      else this.board[row][valueIndex + i] = ship;
    }

    this.ships.push(ship);
    return true;
  }

  areShipsSunk() {
    for (const ship of this.ships) {
      if (!ship.isSunk()) return false;
    }

    return true;
  }

  receiveAttack(coords) {
    const [row, valueIndex] = coords;

    if (this.board[row][valueIndex] instanceof Ship) {
      this.board[row][valueIndex].hit();
      this.hitAttacks.push(coords);

      // add guaranteed empty squares
      this.missedAttacks.push([row - 1, valueIndex - 1]);
      this.missedAttacks.push([row + 1, valueIndex + 1]);
      this.missedAttacks.push([row + 1, valueIndex - 1]);
      this.missedAttacks.push([row - 1, valueIndex + 1]);

      if (this.board[row][valueIndex].isSunk()) {
        const shipSquares = this.findAllShipSquares(
          this.board[row][valueIndex].length,
          coords
        );

        for (const shipSquare of shipSquares) {
          let [newRow, newValueIndex] = shipSquare;

          if (!isArrayInArray(this.hitAttacks, [newRow - 1, newValueIndex]))
            this.missedAttacks.push([newRow - 1, newValueIndex]);
          if (!isArrayInArray(this.hitAttacks, [newRow + 1, newValueIndex]))
            this.missedAttacks.push([newRow + 1, newValueIndex]);
          if (!isArrayInArray(this.hitAttacks, [newRow, newValueIndex - 1]))
            this.missedAttacks.push([newRow, newValueIndex - 1]);
          if (!isArrayInArray(this.hitAttacks, [newRow, newValueIndex + 1]))
            this.missedAttacks.push([newRow, newValueIndex + 1]);
        }
      }

      return true;
    }

    this.missedAttacks.push(coords);
    return false;
  }

  canPlaceShip(ship, coords, options = { vertical: false }) {
    const [row, valueIndex] = coords;

    const axis = options.vertical ? row : valueIndex;
    if (axis + ship.length > 10) return false; // check if ship fits

    for (let i = 0; i < ship.length; i++) {
      // check if no ship in the way
      let curRow = row;
      let curValIndex = valueIndex;

      if (options.vertical) curRow += i;
      if (!options.vertical) curValIndex += i;

      // check if no ship too close
      if (this.board[curRow][curValIndex] instanceof Ship) return false;
      if (
        curValIndex < 9 &&
        this.board[curRow][curValIndex + 1] instanceof Ship
      )
        return false;
      if (
        curValIndex > 0 &&
        this.board[curRow][curValIndex - 1] instanceof Ship
      )
        return false;
      if (curRow < 9) {
        if (this.board[curRow + 1][curValIndex] instanceof Ship) return false;
        if (this.board[curRow + 1][curValIndex + 1] instanceof Ship)
          return false;
        if (this.board[curRow + 1][curValIndex - 1] instanceof Ship)
          return false;
      }
      if (curRow > 0) {
        if (this.board[curRow - 1][curValIndex] instanceof Ship) return false;
        if (this.board[curRow - 1][curValIndex + 1] instanceof Ship)
          return false;
        if (this.board[curRow - 1][curValIndex - 1] instanceof Ship)
          return false;
      }
    }

    return true;
  }

  getSquaresCoveredByNewShip(ship, coords, options = { vertical: false }) {
    const [row, valueIndex] = coords;

    const squaresCovered = [];

    for (let i = 0; i < ship.length; i++) {
      if (options.vertical) {
        if (row + i > 9) return squaresCovered;
        squaresCovered.push([row + i, valueIndex]);
      } else {
        if (valueIndex + i > 9) return squaresCovered;
        squaresCovered.push([row, valueIndex + i]);
      }
    }
    return squaresCovered;
  }

  getNextShipLengthToPlace() {
    const shipsLengthOrder = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    const playerShipsLengths = this.ships.map((ship) => ship.length);
    const currentShipLength = shipsLengthOrder[playerShipsLengths.length];

    return currentShipLength;
  }

  fillRandomly() {
    while (this.getNextShipLengthToPlace()) {
      let currShip = new Ship(this.getNextShipLengthToPlace());

      let randomCoords = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];

      let randomVertical = Math.random() < 0.5;

      this.placeShip(currShip, randomCoords, { vertical: randomVertical });
    }
  }

  findAllShipSquares(length, coords) {
    const [row, valueIndex] = coords;

    const result = [coords];

    for (let i = 1; i < length; i++) {
      if (row + i > 9) break;

      if (this.board[row + i][valueIndex] instanceof Ship)
        result.push([row + i, valueIndex]);
      else break;
    }

    for (let i = 1; i < length; i++) {
      if (row - i < 0) break;

      if (this.board[row - i][valueIndex] instanceof Ship)
        result.push([row - i, valueIndex]);
      else break;
    }

    for (let i = 1; i < length; i++) {
      if (valueIndex + i > 9) break;

      if (this.board[row][valueIndex + i] instanceof Ship)
        result.push([row, valueIndex + i]);
      else break;
    }

    for (let i = 1; i < length; i++) {
      if (valueIndex - i < 0) break;

      if (this.board[row][valueIndex - i] instanceof Ship)
        result.push([row, valueIndex - i]);
      else break;
    }

    return result;
  }

  addAdjacentSquaresToQueue(coords) {
    const [row, valueIndex] = coords;
    const queue = this.possibleHitsQueue;

    if (row > 0) queue.push([row - 1, valueIndex]);
    if (valueIndex < 9) queue.push([row, valueIndex + 1]);
    if (row < 9) queue.push([row + 1, valueIndex]);
    if (valueIndex > 0) queue.push([row, valueIndex - 1]);
  }
}

class Player {
  constructor() {
    this.gameboard = new Gameboard();
  }

  attack(player, coords) {
    return player.gameboard.receiveAttack(coords);
  }

  attackRandom(player) {
    // remove missed and hit attacks from queue
    const pGboard = player.gameboard;

    const usedAttacks = pGboard.missedAttacks.concat(pGboard.hitAttacks);

    pGboard.possibleHitsQueue = pGboard.possibleHitsQueue.filter(
      (queuedAttack) => !isArrayInArray(usedAttacks, queuedAttack)
    );

    // get coords from queue randomly, if queue empty then roll
    if (pGboard.possibleHitsQueue.length > 0) {
      const randIndex = Math.floor(
        Math.random() * pGboard.possibleHitsQueue.length
      );

      const randPossibleHit = pGboard.possibleHitsQueue[randIndex];

      if (pGboard.receiveAttack(randPossibleHit)) {
        pGboard.addAdjacentSquaresToQueue(randPossibleHit);
      }
      return;
    }

    const row = Math.floor(Math.random() * 10);
    const valueIndex = Math.floor(Math.random() * 10);

    const coords = [row, valueIndex];

    for (const usedAttack of usedAttacks) {
      if (usedAttack[0] === coords[0] && usedAttack[1] === coords[1]) {
        this.attackRandom(player);
        return;
      }
    }

    if (pGboard.receiveAttack(coords)) {
      pGboard.addAdjacentSquaresToQueue(coords);
    }
  }
}

export { Ship, Gameboard, Player };
