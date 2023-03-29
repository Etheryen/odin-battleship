import { Gameboard } from '../js/classes';
import renderApp from '../js/renderApp';

export default function PlayerEl({
  playerObj,
  title,
  isEnemy = false,
  attackingPlayerObj,
  isGameOver,
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'player';

  const boardEl = document.createElement('table');
  boardEl.className = 'board';

  let row = document.createElement('tr');
  row.appendChild(document.createElement('div'));

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  for (const colName of columns) {
    let column = document.createElement('th');
    column.innerHTML = colName;
    row.appendChild(column);
  }

  boardEl.appendChild(row);

  for (let rowNum = 0; rowNum < 10; rowNum++) {
    let row = document.createElement('tr');
    for (let colNum = -1; colNum < 10; colNum++) {
      let tile = createTile([rowNum, colNum]);
      row.appendChild(tile);
    }
    boardEl.appendChild(row);
  }

  const titleEl = document.createElement('h1');
  titleEl.className = 'title';
  titleEl.innerHTML = title;

  wrapper.appendChild(boardEl);
  wrapper.appendChild(titleEl);
  return wrapper;

  // helper functions

  function styleTile(tile, coords) {
    const [rowNum, colNum] = coords;
    const pGboard = playerObj.gameboard;

    if (Gameboard.isAttackInArray(coords, pGboard.missedAttacks)) {
      tile.innerHTML = '·'; // or '•'
      return;
    }

    if (Gameboard.isAttackInArray(coords, pGboard.hitAttacks)) {
      tile.innerHTML = '✕'; // or svg

      if (pGboard.board[rowNum][colNum]?.isSunk())
        tile.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';

      return;
    }

    if (!isEnemy) {
      const shipMaybe = pGboard.board[rowNum][colNum];
      tile.innerHTML = shipMaybe ? shipMaybe.length - shipMaybe.timesHit : '';
    }
  }

  function createTile(coords) {
    const [rowNum, colNum] = coords;

    if (colNum < 0) {
      const tile = document.createElement('th');
      tile.innerHTML = rowNum + 1;
      return tile;
    }

    const pGboard = playerObj.gameboard;

    const tile = document.createElement('td');
    styleTile(tile, coords);

    if (
      isEnemy &&
      !Gameboard.isAttackInArray(
        coords,
        pGboard.missedAttacks.concat(pGboard.hitAttacks)
      )
    ) {
      // turns
      if (isGameOver) return tile;
      tile.onclick = () => {
        attackingPlayerObj.attack(playerObj, coords);

        if (!playerObj.gameboard.areShipsSunk()) {
          playerObj.attackRandom(attackingPlayerObj);
        }

        const isGameOver =
          attackingPlayerObj.gameboard.areShipsSunk() ||
          playerObj.gameboard.areShipsSunk();

        renderApp({
          player: attackingPlayerObj,
          computer: playerObj,
          isGameOver,
        });
      };
    }
    return tile;
  }
}
