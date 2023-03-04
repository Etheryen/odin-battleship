import { Gameboard } from '../classes';
import renderApp from '../renderApp';

export default function PlayerEl({
  playerObj,
  title,
  isEnemy = false,
  attackingPlayerObj,
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
      if (colNum < 0) {
        let tile = document.createElement('th');
        tile.innerHTML = rowNum + 1;
        row.appendChild(tile);
      } else {
        let tile = document.createElement('td');
        if (
          Gameboard.isAttackInArray(
            [rowNum, colNum],
            playerObj.gameboard.missedAttacks
          )
        )
          tile.innerHTML = '·'; // or '•'
        else if (
          Gameboard.isAttackInArray(
            [rowNum, colNum],
            playerObj.gameboard.hitAttacks
          )
        )
          tile.innerHTML = '✕'; // or svg
        else {
          tile.innerHTML = isEnemy
            ? ''
            : playerObj.gameboard.board[rowNum][colNum]?.timesHit ?? '';
        }

        if (
          isEnemy &&
          !Gameboard.isAttackInArray(
            [rowNum, colNum],
            playerObj.gameboard.missedAttacks
          ) &&
          !Gameboard.isAttackInArray(
            [rowNum, colNum],
            playerObj.gameboard.hitAttacks
          )
        ) {
          tile.onclick = () => {
            attackingPlayerObj.attack(playerObj, [rowNum, colNum]);
            renderApp({ player: attackingPlayerObj, computer: playerObj });
          };
        }
        row.appendChild(tile);
      }
    }
    boardEl.appendChild(row);
  }

  const titleEl = document.createElement('h1');
  titleEl.className = 'title';
  titleEl.innerHTML = title;

  wrapper.appendChild(boardEl);
  wrapper.appendChild(titleEl);
  return wrapper;
}
