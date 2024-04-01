import { initGarage } from '../../pages/garage/garage-page';
import { initWinners } from '../../pages/winners/winners-page';
import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import styles from './router.module.css';

class Router extends BaseComponent {
  constructor() {
    super({
      parentNode: document.body,
      tag: 'div',
      className: styles.router,
    });
    globalEventPipe.sub('change-page', this.switchPage.bind(this));
    globalEventPipe.pub('change-page', 'garage');
  }

  switchPage(name: 'garage' | 'winners') {
    globalEventPipe.implode(['change-page']);
    this.clear();
    switch (name) {
      case 'garage':
        initGarage(this);
        break;
      case 'winners':
        initWinners(this);
        break;
      default:
        throw new Error('Page not found');
    }
  }
}

const initRouter = () => {
  const router = new Router();
  return { router };
};

export { initRouter };
