import { Player } from './js/classes';
import renderShipPlacing from './js/renderShipPlacing';
import './style.css';

const player = new Player();

renderShipPlacing({ player });
