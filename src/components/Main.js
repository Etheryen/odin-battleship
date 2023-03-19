import PlayerEl from './PlayerEl';

export default function Main({ player, computer, isGameOver }) {
  const main = document.createElement('main');

  if (isGameOver) {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.className = 'gameOverMessage';

    const message = player.gameboard.areShipsSunk() ? 'Defeat!' : 'Victory!';
    gameOverMessage.innerHTML = message;

    main.appendChild(gameOverMessage);
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
