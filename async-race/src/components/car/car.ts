import BaseComponent from '../../utils/base-component';
import styles from './car.module.css';

class Car extends BaseComponent {
  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ tag: 'div', className: styles.car, parentNode });
  }
}

export { Car };
