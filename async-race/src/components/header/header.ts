import BaseComponent from '../../utils/base-component';
import styles from './header.module.css';

class Header extends BaseComponent {
  constructor() {
    super({
      parentNode: document.body,
      tag: 'header',
      className: styles.header,
      content: 'Async Race',
    });
  }
}

const initHeader = () => {
  const header = new Header();
  return header;
};

export { initHeader };
