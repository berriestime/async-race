import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import styles from './header.module.css';

class Header extends BaseComponent {
  constructor() {
    super({
      parentNode: document.body,
      tag: 'header',
      className: styles.header,
      content: 'Async Race',
    });

    const goToGarageButton = new BaseComponent({
      parentNode: this,
      tag: 'button',
      className: styles.goToGarageButton,
      content: 'Garage',
    });
    goToGarageButton.addListener('click', () => {
      globalEventPipe.pub('change-page', 'garage');
    });

    const goToWinnersButton = new BaseComponent({
      parentNode: this,
      tag: 'button',
      className: styles.goToWinnersButton,
      content: 'Winners',
    });
    goToWinnersButton.addListener('click', () => {
      globalEventPipe.pub('change-page', 'winners');
    });
  }
}

const initHeader = () => {
  const header = new Header();
  return header;
};

export { initHeader };
