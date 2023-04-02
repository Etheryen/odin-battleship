import { Player, Ship } from '../js/classes';
import renderApp from '../js/renderApp';
import renderShipPlacing from '../js/renderShipPlacing';

export default function ShipPlacing({
  player,
  hoveredSquare,
  vertical = false,
}) {
  const main = document.createElement('main');
  main.className = 'shipPlacing';

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

  const titleEl1 = document.createElement('h1');
  titleEl1.className = 'title';
  titleEl1.innerHTML = 'Place your ships';

  const titleEl2 = document.createElement('h1');
  titleEl2.className = 'title';
  titleEl2.innerHTML = 'Hit SPACE to flip 90°';

  wrapper.appendChild(boardEl);
  wrapper.appendChild(titleEl1);
  wrapper.appendChild(titleEl2);

  main.appendChild(wrapper);

  main.addEventListener('keypress', handleKeyPress);
  main.tabIndex = 0;
  return main;

  // helper functions

  function createTile(coords) {
    const [rowNum, colNum] = coords;

    if (colNum < 0) {
      const tile = document.createElement('th');
      tile.innerHTML = rowNum + 1;
      return tile;
    }

    const tile = document.createElement('td');

    const isShip = player.gameboard.board[rowNum][colNum] instanceof Ship;
    tile.className = isShip ? 'ship' : '';

    // dont put event listener on hovered square to prevent infinite renders
    if (coords.toString() !== hoveredSquare?.toString()) {
      tile.onmouseenter = () => {
        renderShipPlacing({
          player,
          hoveredSquare: [rowNum, colNum],
          vertical,
        });
      };
    }

    tile.onmouseleave = () => {
      renderShipPlacing({
        player,
        hoveredSquare: undefined,
        vertical,
      });
    };

    if (hoveredSquare) {
      const pGboard = player.gameboard;
      const currentShipLength = pGboard.getNextShipLengthToPlace();
      const currShip = new Ship(currentShipLength);
      const isLegal = pGboard.canPlaceShip(currShip, hoveredSquare, {
        vertical,
      });

      const coveredSquares = pGboard.getSquaresCoveredByNewShip(
        currShip,
        hoveredSquare,
        {
          vertical,
        }
      );

      if (isArrayInArray(coveredSquares, coords)) {
        tile.className = isLegal ? 'legal' : 'illegal';
      }

      if (isLegal && coords.toString() === hoveredSquare?.toString()) {
        tile.onclick = () => {
          pGboard.placeShip(currShip, hoveredSquare, { vertical });
          if (pGboard.getNextShipLengthToPlace()) {
            renderShipPlacing({
              player,
              hoveredSquare,
              vertical,
            });
            return;
          }

          const computer = new Player();
          computer.gameboard.fillRandomly();

          renderApp({ player, computer });
        };
      }
    }

    return tile;
  }

  function handleKeyPress(event) {
    if (event.code === 'Space')
      renderShipPlacing({ player, hoveredSquare, vertical: !vertical });
  }
}

function isArrayInArray(arr, item) {
  return arr.some((ele) => JSON.stringify(ele) === JSON.stringify(item));
}
