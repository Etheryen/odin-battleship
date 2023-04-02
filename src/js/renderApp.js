import Footer from '../components/Footer';
import Header from '../components/Header';
import Main from '../components/Main';

export default function renderApp({ player, computer, isGameOver }) {
  const elements = [
    Header(),
    Main({
      player,
      computer,
      isGameOver,
    }),
    Footer(),
  ];

  document.body.innerHTML = '';
  for (const el of elements) {
    document.body.appendChild(el);
  }
}
