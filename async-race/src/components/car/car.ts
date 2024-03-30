import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import { DeleteButton } from '../delete-button/delete-button';
import { SelectButton } from '../select-car/select-car';
import { StartButton } from '../start-button/start-button';
import { StopButton } from '../stop-button/stop-button';
import styles from './car.module.css';

type CarType = { id: number; name: string; color: string };

class Car extends BaseComponent {
  id: number;

  carModel: BaseComponent;

  startEngineButton: StartButton;

  stopEngineButton: StopButton;

  // eslint-disable-next-line max-lines-per-function
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
    globalEventPipe.sub('time', this.onTimeUpdate.bind(this));
    const selectCar = new SelectButton({ parentNode: this, onClick: onSelectClick });
    const removeCar = new DeleteButton({ parentNode: this, onClick: onDeleteClick });
    const description = new BaseComponent({
      tag: 'div',
      className: styles.description,
      parentNode: this,
      content: `${car.id} ${car.name}`,
    });
    const racetrack = new BaseComponent({
      tag: 'div',
      className: styles.racetrack,
      parentNode: this,
    });
    const carModel = new BaseComponent({
      tag: 'div',
      className: styles.carModel,
      parentNode: racetrack,
    });
    carModel.setAttributes({ style: `background-color: ${car.color}` });
    const localOnStopClick = () => {
      carModel.stopAnimations();
      onStopClick();
    };

    const startEngineButton = new StartButton({ parentNode: this, onClick: onStartClick });
    const stopEngineButton = new StopButton({ parentNode: this, onClick: localOnStopClick });
    stopEngineButton.setAttributes({ disabled: 'disabled' });
    this.id = car.id;
    this.carModel = carModel;
    this.startEngineButton = startEngineButton;
    this.stopEngineButton = stopEngineButton;
  }

  onTimeUpdate(id: number, time: number) {
    if (id !== this.id) {
      return;
    }
    this.stopEngineButton.removeAttributes('disabled');
    this.startEngineButton.setAttributes({ disabled: 'disabled' });
    this.carModel
      .animate([{ left: '0px' }, { left: 'calc(100% - 50px)' }], {
        duration: time,
        iterations: 1,
      })
      .finished.then(() => {
        this.startEngineButton.removeAttributes('disabled');
        this.stopEngineButton.setAttributes({ disabled: 'disabled' });
      })
      .catch(() => {});
  }
}

export { Car, type CarType };
