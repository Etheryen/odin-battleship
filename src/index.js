import { Gameboard, Player, Ship } from './classes';
import Footer from './components/Footer';
import Header from './components/Header';
import Main from './components/Main';
import './style.css';

const player = new Player();
const computer = new Player();

player.gameboard.placeShip(new Ship(3), Gameboard.parseCoords(['B', 2]));

function App() {
  return [
    Header(),
    Main({
      player,
      computer,
    }),
    Footer(),
  ];
}

for (const el of App()) {
  document.body.appendChild(el);
}
