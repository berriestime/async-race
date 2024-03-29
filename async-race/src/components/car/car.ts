import BaseComponent from '../../utils/base-component';
import { DeleteButton } from '../delete-button/delete-button';
import { SelectButton } from '../select-car/select-car';
import { StartButton } from '../start-button/start-button';
import { StopButton } from '../stop-button/stop-button';
import styles from './car.module.css';

type CarType = { id: number; name: string; color: string };

class Car extends BaseComponent {
  constructor({
    parentNode,
    car,
    onSelectClick,
    onDeleteClick,
    onStartClick,
    onStopClick,
  }: {
    parentNode: BaseComponent;
    car: CarType;
    onSelectClick: () => void;
    onDeleteClick: () => void;
    onStartClick: () => void;
    onStopClick: () => void;
  }) {
    super({ tag: 'div', className: styles.car, parentNode });
    const selectCar = new SelectButton({ parentNode: this, onClick: onSelectClick });
    const removeCar = new DeleteButton({ parentNode: this, onClick: onDeleteClick });
    const description = new BaseComponent({
      tag: 'div',
      className: styles.description,
      parentNode: this,
      content: `${car.id} ${car.name} ${car.color}`,
    });
    const startEngineButton = new StartButton({ parentNode: this, onClick: onStartClick });
    const stopEngineButton = new StopButton({ parentNode: this, onClick: onStopClick });
  }
}

export { Car, type CarType };
