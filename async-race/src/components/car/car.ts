import BaseComponent from '../../utils/base-component';
import { DeleteButton } from '../delete-button/delete-button';
import { SelectButton } from '../select-car/select-car';
import styles from './car.module.css';

type CarType = { id: number; name: string; color: string };

class Car extends BaseComponent {
  constructor({
    parentNode,
    car,
    onSelectClick,
    onDeleteClick,
  }: {
    parentNode: BaseComponent;
    car: CarType;
    onSelectClick: () => void;
    onDeleteClick: () => void;
  }) {
    super({ tag: 'div', className: styles.car, parentNode });
    const selectCar = new SelectButton({
      parentNode: this,
      onClick: onSelectClick,
    });
    const removeCar = new DeleteButton({
      parentNode: this,
      onClick: onDeleteClick,
    });
    const description = new BaseComponent({
      tag: 'div',
      className: styles.description,
      parentNode: this,
      content: `${car.id} ${car.name} ${car.color}`,
    });
    const startEngineButton = new BaseComponent({
      tag: 'button',
      className: styles.startButton,
      parentNode: this,
      content: 'Start Engine',
    });
    const stopEngineButton = new BaseComponent({
      tag: 'button',
      className: styles.stopButton,
      parentNode: this,
      content: 'Stop Engine',
    });
  }
}

export { Car, type CarType };
