import Footer from './components/Footer';
import Header from './components/Header';
import Main from './components/Main';

export default function renderApp({ player, computer }) {
  const elements = [
    Header(),
    Main({
      player,
      computer,
    }),
    Footer(),
  ];

  document.body.innerHTML = '';
  for (const el of elements) {
    document.body.appendChild(el);
  }
}
