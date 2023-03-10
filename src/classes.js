// export function prettyPrintBoard(board) {
//   let result = '';

//   for (const row of board) {
//     for (const value of row) {
//       if (value instanceof Ship) result += value.timesHit + '    ';
//       else result += value + ' ';
//     }
//     result += '\n';
//   }

//   console.log(result);
// }

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

    const axis = options.vertical ? row : valueIndex;
    if (axis + ship.length > 10) return false; // check if ship fits

    for (let i = 0; i < ship.length; i++) {
      // check if no ship in the way
      if (options.vertical && this.board[row + i][valueIndex] !== null)
        return false;

      if (!options.vertical && this.board[row][valueIndex + i] !== null)
        return false;
    }

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
    // maybe uselless returns
    const [row, valueIndex] = coords;

    if (this.board[row][valueIndex] instanceof Ship) {
      this.board[row][valueIndex].hit();
      this.hitAttacks.push(coords);
      return true;
    }

    this.missedAttacks.push(coords);
    return false;
  }
}

class Player {
  constructor() {
    this.gameboard = new Gameboard();
  }

  attack(player, coords) {
    player.gameboard.receiveAttack(coords);
  }

  attackRandom(player) {
    const row = Math.floor(Math.random() * 10);
    const valueIndex = Math.floor(Math.random() * 10);

    const coords = [row, valueIndex];

    for (const usedAttack of player.gameboard.missedAttacks.concat(
      player.gameboard.hitAttacks
    )) {
      if (usedAttack[0] === coords[0] && usedAttack[1] === coords[1]) {
        this.attackRandom(player);
        return;
      }
    }

    player.gameboard.receiveAttack(coords);
  }
}

export { Ship, Gameboard, Player };
