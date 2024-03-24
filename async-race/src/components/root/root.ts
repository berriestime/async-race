import BaseComponent from '../../utils/base-component';
import styles from './root.module.css';

export default class RootComponent extends BaseComponent {
  constructor() {
    super({
      parentNode: document.body,
      tag: 'div',
      className: styles.pageContainer,
    });
  }
}
