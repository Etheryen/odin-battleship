export default function PlayerEl({ playerObj, title }) {
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
        tile.innerHTML =
          playerObj.gameboard.board[rowNum][colNum]?.timesHit ?? '~';
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
