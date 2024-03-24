import BaseComponent from '../../utils/base-component';
import styles from './footer.module.css';

class Footer extends BaseComponent {
  constructor() {
    super({
      parentNode: document.body,
      tag: 'footer',
      className: styles.footer,
      content: 'berriestime, 2024',
    });
  }
}

const initFooter = () => {
  const footer = new Footer();

  return footer;
};

export default initFooter;
