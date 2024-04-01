import { Api } from '../../api/api';
import BaseComponent from '../../utils/base-component';
import styles from './winners.module.css';

class Winners extends BaseComponent {
  sortKey: 'id' | 'wins' | 'time' = 'wins';

  sortDirection: 'ASC' | 'DESC' = 'DESC';

  page = 1;

  totalCount = 0;

  constructor(parentNode: BaseComponent) {
    super({ parentNode, tag: 'div', className: styles.pageContainer });
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
    const { winners: rawWinners, totalCount } = await Api.getWinners(
      this.sortKey,
      this.sortDirection,
      this.page,
    );
    this.totalCount = parseInt(totalCount ?? '0', 10);
    const cars = await Promise.all(rawWinners.map((winner) => Api.getCar(winner.id)));
    const winners = rawWinners.map((winner, index) => ({
      id: winner.id,
      name: cars[index].name,
      color: cars[index].color,
      wins: winner.wins,
      time: winner.time,
    }));

    const leftButton = new BaseComponent({
      parentNode: this,
      tag: 'button',
      className: styles.leftButton,
      content: '<',
    });
    leftButton.addListener('click', () => {
      if (this.page <= 1) return;
      this.page -= 1;
      this.initWinners();
    });

    const pageNumber = new BaseComponent({
      parentNode: this,
      tag: 'span',
      content: `Page ${this.page}/${Math.ceil(this.totalCount / 10)}. Total ${this.totalCount} winners`,
    });
    pageNumber.addClass(styles.pageNumber);

    const rightButton = new BaseComponent({
      parentNode: this,
      tag: 'button',
      className: styles.rightButton,
      content: '>',
    });
    rightButton.addListener('click', () => {
      if (this.page >= Math.ceil(this.totalCount / 10)) return;
      this.page += 1;
      this.initWinners();
    });

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

    // eslint-disable-next-line max-lines-per-function
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
      const catCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
      });
      const carModel = new BaseComponent({
        parentNode: catCell,
        tag: 'div',
        className: styles.carModel,
      });
      carModel.style.backgroundColor = winner.color;
      const winsCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
        content: String(winner.wins),
      });
      const timeCell = new BaseComponent({
        parentNode: winnerRow,
        tag: 'td',
        content: `${(winner.time / 1000).toFixed(2)} s`,
      });

      return {
        idCell,
        nameCell,
        catCell,
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

const initWinners = (parentNode: BaseComponent) => {
  const winners = new Winners(parentNode);
  return { winners };
};

export { initWinners };
