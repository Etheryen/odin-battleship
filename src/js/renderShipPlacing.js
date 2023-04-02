import Footer from '../components/Footer';
import Header from '../components/Header';
import ShipPlacing from '../components/ShipPlacing';

export default function renderShipPlacing({ player, hoveredSquare, vertical }) {
  const elements = [
    Header(),
    ShipPlacing({
      player,
      hoveredSquare,
      vertical,
    }),
    Footer(),
  ];

  document.body.innerHTML = '';
  for (const el of elements) {
    document.body.appendChild(el);
  }

  document.querySelector('main').focus();
}
