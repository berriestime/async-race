import { Api } from '../../api/api';
import BaseComponent from '../../utils/base-component';
import styles from './winners.module.css';

class Winners extends BaseComponent {
  temp: BaseComponent | null = null;

  constructor() {
    super({ parentNode: document.body, tag: 'div', className: styles.pageContainer });
    this.initWinners();
  }

  async initWinners() {
    const winners = await Api.getWinners();
    this.temp = new BaseComponent({
      tag: 'pre',
      content: JSON.stringify(winners, null, 2),
      parentNode: this,
    });
  }
}

const initWinners = () => {
  const winners = new Winners();
  return { winners };
};

export { initWinners };
