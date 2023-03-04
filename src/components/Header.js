export default function Header() {
  const header = document.createElement('header');
  const h1 = document.createElement('h1');

  h1.innerHTML = 'Battleship';

  header.appendChild(h1);

  return header;
}
