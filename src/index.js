import { Gameboard, Player, Ship } from './classes';
import renderApp from './renderApp';
import './style.css';

const player = new Player();
const computer = new Player();

//TEST PURPOSES
function tests() {
  // 4x 1 length
  // 3x 2 length
  // 2x 3 length
  // 1x 4 length
  player.gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['J', 5]), {
    vertical: true,
  });
  player.gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['B', 2]), {
    vertical: true,
  });
  player.gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['B', 10]));
  player.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['F', 9]));
  player.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['C', 6]));
  player.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['G', 3]), {
    vertical: true,
  });
  player.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['I', 2]));
  player.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['H', 7]));
  player.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['E', 2]));
  player.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['G', 1]));

  // computer
  computer.gameboard.placeShip(new Ship(4), Gameboard.parseCoords(['A', 1]), {
    vertical: true,
  });
  computer.gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['I', 8]), {
    vertical: true,
  });
  computer.gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['B', 8]));
  computer.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['D', 10]));
  computer.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['D', 6]));
  computer.gameboard.placeShip(new Ship(2), Gameboard.parseCoords(['G', 3]), {
    vertical: true,
  });
  computer.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['I', 2]));
  computer.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['J', 5]));
  computer.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['D', 2]));
  computer.gameboard.placeShip(new Ship(1), Gameboard.parseCoords(['D', 4]));
}
tests();

renderApp({ player, computer });
