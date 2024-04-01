import { Api } from '../../api/api';
import BaseComponent from '../../utils/base-component';
import styles from './winners.module.css';

class Winners extends BaseComponent {
  sortKey: 'id' | 'wins' | 'time' = 'wins';

  sortDirection: 'ASC' | 'DESC' = 'DESC';

  constructor() {
    super({ parentNode: document.body, tag: 'div', className: styles.pageContainer });
    this.initWinners();
  }

  getColumnClickHandler(sortKey: 'id' | 'wins' | 'time') {
    return () => {
      if (sortKey === this.sortKey) {
        if (this.sortDirection === 'ASC') {
          this.sortDirection = 'DESC';
        } else {
          this.sortDirection = 'ASC';
        }
      } else {
        this.sortKey = sortKey;
        this.sortDirection = 'ASC';
      }
      this.initWinners();
    };
  }

  // eslint-disable-next-line max-lines-per-function
  async initWinners() {
    this.clear();
    const rawWinners = await Api.getWinners(this.sortKey, this.sortDirection);
    const cars = await Promise.all(rawWinners.map((winner) => Api.getCar(winner.id)));
    const winners = rawWinners.map((winner, index) => ({
      id: winner.id,
      name: cars[index].name,
      color: cars[index].color,
      wins: winner.wins,
      time: winner.time,
    }));

    const winnerContainer = new BaseComponent({
      parentNode: this,
      tag: 'table',
      className: styles.winnerContainer,
    });
    const headerRow = new BaseComponent({
      parentNode: winnerContainer,
      tag: 'tr',
    });
    const idHeader = new BaseComponent({
      parentNode: headerRow,
      tag: 'th',
      content: 'ID',
    });
    idHeader.addListener('click', this.getColumnClickHandler('id'));
    const nameHeader = new BaseComponent({
      parentNode: headerRow,
      tag: 'th',
      content: 'Name',
    });
    const colorHeader = new BaseComponent({
      parentNode: headerRow,
      tag: 'th',
      content: 'Color',
    });
    const winsHeader = new BaseComponent({
      parentNode: headerRow,
      tag: 'th',
      content: 'Wins',
    });
    winsHeader.addListener('click', this.getColumnClickHandler('wins'));
    const timeHeader = new BaseComponent({
      parentNode: headerRow,
      tag: 'th',
      content: 'Time',
    });
    timeHeader.addListener('click', this.getColumnClickHandler('time'));

    winners.forEach((winner) => {
      const winnerRow = new BaseComponent({
        parentNode: winnerContainer,
        tag: 'tr',
      });
      const idCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
        content: String(winner.id),
      });
      const nameCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
        content: winner.name,
      });
      const colorCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
        content: winner.color,
      });
      const winsCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
        content: String(winner.wins),
      });
      const timeCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
        content: String(winner.time),
      });
      return {
        idCell,
        nameCell,
        colorCell,
        winsCell,
        timeCell,
      };
    });

    return {
      winnerContainer,
      idHeader,
      nameHeader,
      colorHeader,
      winsHeader,
      timeHeader,
    };
  }
}

const initWinners = () => {
  const winners = new Winners();
  return { winners };
};

export { initWinners };
