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

  events: Events;

  localOnStopClick: () => void;

  localOnStartClick: () => void;

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

    this.events = events;
    this.localOnStopClick = () => {
      this.carModel?.removeClass(styles.carCrashed);
      this.carModel?.addClass(styles.carModel);
      this.carModel?.stopAnimations();
      this.events.onStopClick();
    };
    this.localOnStartClick = () => {
      this.carModel?.addClass(styles.carModelRun);
      this.events.onStartClick();
    };
    this.subscribeToGlobalEvents();
    this.createUIElements(car, events);
  }

  subscribeToGlobalEvents(): void {
    globalEventPipe.sub('break-engine', this.onCrash.bind(this));
    globalEventPipe.sub('time', this.onTimeUpdate.bind(this));
    globalEventPipe.sub('race-start', this.localOnStartClick);
    globalEventPipe.sub('race-reset', this.localOnStopClick);
  }

  createUIElements(car: CarType, events: Events): void {
    const selectCar = new SelectButton({ parentNode: this, onClick: events.onSelectClick });
    selectCar.addClass(styles.selectButton);
    const removeCar = new DeleteButton({ parentNode: this, onClick: events.onDeleteClick });
    removeCar.addClass(styles.removeButton);
    const description = this.createDescription(car);
    description.addClass(styles.description);
    const racetrack = this.createRaceTrack();
    this.createCarModel(racetrack, car);
    this.createButtons();

    this.id = car.id;
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

  createCarModel(parentNode: BaseComponent, car: CarType) {
    this.carModel = new BaseComponent({
      tag: 'div',
      className: styles.carModel,
      parentNode,
    });
    this.carModel.setAttributes({ style: `background-color: ${car.color}` });
  }

  createButtons(): void {
    this.startEngineButton = new StartButton({ parentNode: this, onClick: this.localOnStartClick });
    this.stopEngineButton = new StopButton({ parentNode: this, onClick: this.localOnStopClick });

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
          fill: 'forwards',
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
      this.carModel.addClass(styles.carCrashed);
      this.stopEngineButton.setAttributes({ disabled: 'disabled' });
      this.startEngineButton.removeAttributes('disabled');
      this.carModel.pauseAnimations();
    }
  }
}

export { Car, type CarType };
