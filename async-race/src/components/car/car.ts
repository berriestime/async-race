import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import { DeleteButton } from '../delete-button/delete-button';
import { SelectButton } from '../select-car/select-car';
import { StartButton } from '../start-button/start-button';
import { StopButton } from '../stop-button/stop-button';
import styles from './car.module.css';

type CarType = { id: number; name: string; color: string };

type Events = {
  onSelectClick: () => void;
  onDeleteClick: () => void;
  onStartClick: () => void;
  onStopClick: () => void;
};

class Car extends BaseComponent {
  id: number | undefined;

  carModel: BaseComponent | undefined;

  startEngineButton: StartButton | undefined;

  stopEngineButton: StopButton | undefined;

  constructor({
    parentNode,
    car,
    events,
  }: {
    parentNode: BaseComponent;
    car: CarType;
    events: Events;
  }) {
    super({ tag: 'div', className: styles.car, parentNode });

    this.subscribeToGlobalEvents();
    this.createUIElements(car, events);
  }

  subscribeToGlobalEvents(): void {
    globalEventPipe.sub('break-engine', this.onCrash.bind(this));
    globalEventPipe.sub('time', this.onTimeUpdate.bind(this));
  }

  createUIElements(car: CarType, events: Events): void {
    const selectCar = new SelectButton({ parentNode: this, onClick: events.onSelectClick });
    const removeCar = new DeleteButton({ parentNode: this, onClick: events.onDeleteClick });
    const description = this.createDescription(car);
    const racetrack = this.createRaceTrack();
    const carModel = this.createCarModel(racetrack, car);

    this.createButtons(carModel, events);

    this.id = car.id;
    this.carModel = carModel;
  }

  createDescription(car: CarType): BaseComponent {
    return new BaseComponent({
      tag: 'div',
      className: styles.description,
      parentNode: this,
      content: `${car.id} ${car.name}`,
    });
  }

  createRaceTrack(): BaseComponent {
    return new BaseComponent({
      tag: 'div',
      className: styles.racetrack,
      parentNode: this,
    });
  }

  createCarModel(parentNode: BaseComponent, car: CarType): BaseComponent {
    const carModel = new BaseComponent({
      tag: 'div',
      className: styles.carModel,
      parentNode,
    });
    carModel.setAttributes({ style: `background-color: ${car.color}` });
    return carModel;
  }

  createButtons(carModel: BaseComponent, events: Events): void {
    const localOnStopClick = () => {
      carModel.stopAnimations();
      events.onStopClick();
    };

    const localOnStartClick = () => {
      carModel.addClass(styles.carModelRun);
      events.onStartClick();
    };

    this.startEngineButton = new StartButton({ parentNode: this, onClick: localOnStartClick });
    this.stopEngineButton = new StopButton({ parentNode: this, onClick: localOnStopClick });

    this.stopEngineButton.setAttributes({ disabled: 'disabled' });
  }

  onTimeUpdate(id: number, time: number) {
    if (id !== this.id) {
      return;
    }

    if (this.stopEngineButton && this.startEngineButton && this.carModel) {
      const { stopEngineButton, startEngineButton, carModel } = this;

      stopEngineButton.removeAttributes('disabled');
      startEngineButton.setAttributes({ disabled: 'disabled' });

      carModel
        .animate([{ left: '0px' }, { left: 'calc(100% - 50px)' }], {
          duration: time,
          iterations: 1,
        })
        .finished.then(() => {
          carModel.removeClass(styles.carModelRun);
          startEngineButton.removeAttributes('disabled');
          stopEngineButton.setAttributes({ disabled: 'disabled' });
        })
        .catch(() => {});
    }
  }

  onCrash(id: number) {
    if (id !== this.id) {
      return;
    }
    if (this.stopEngineButton && this.startEngineButton && this.carModel) {
      this.carModel.removeClass(styles.carModelRun);
      this.stopEngineButton.setAttributes({ disabled: 'disabled' });
      this.startEngineButton.removeAttributes('disabled');
      this.carModel.pauseAnimations();
    }
  }
}

export { Car, type CarType };
