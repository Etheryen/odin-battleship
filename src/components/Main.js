import PlayerEl from './PlayerEl';

export default function Main({ player, computer }) {
  const main = document.createElement('main');

  main.appendChild(PlayerEl({ playerObj: player, title: 'Player' }));
  main.appendChild(
    PlayerEl({
      playerObj: computer,
      title: 'Computer',
      isEnemy: true,
      attackingPlayerObj: player,
    })
  );

  return main;
}
