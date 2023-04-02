import { Player } from '../js/classes';
import renderShipPlacing from '../js/renderShipPlacing';
import PlayerEl from './PlayerEl';

export default function Main({ player, computer, isGameOver }) {
  const main = document.createElement('main');

  if (isGameOver) {
    const gameOverWrapper = document.createElement('div');
    gameOverWrapper.className = 'gameOverWrapper';

    const gameOverMessage = document.createElement('div');
    gameOverMessage.className = 'gameOverMessage';

    const message = player.gameboard.areShipsSunk() ? 'Defeat!' : 'Victory!';
    gameOverMessage.innerHTML = message;

    const playAgain = document.createElement('button');
    playAgain.innerHTML = 'Play again';
    playAgain.onclick = () => {
      renderShipPlacing({ player: new Player() });
    };

    gameOverWrapper.appendChild(gameOverMessage);
    gameOverWrapper.appendChild(playAgain);
    main.appendChild(gameOverWrapper);
  }

  const players = document.createElement('div');
  players.className = 'players';

  players.appendChild(
    PlayerEl({ playerObj: player, title: 'Player', isGameOver })
  );
  players.appendChild(
    PlayerEl({
      playerObj: computer,
      title: 'Computer',
      isEnemy: true,
      attackingPlayerObj: player,
      isGameOver,
    })
  );

  main.appendChild(players);

  return main;
}
