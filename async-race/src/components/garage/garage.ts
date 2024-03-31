import BaseComponent from '../../utils/base-component';
import { Api } from '../../api/api';
import styles from './garage.module.css';
import { Car } from '../car/car';
import { globalEventPipe } from '../../utils/event-emitter';

class GarageContainer extends BaseComponent {
  garage: BaseComponent;

  totalCarsCount: BaseComponent;

  prevButton: BaseComponent;

  nextButton: BaseComponent;

  page: BaseComponent;

  engineStatus: { [key: number]: 'started' | 'stopped' } = {};

  currentPage: number = 1;

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ parentNode, tag: 'div', className: styles.garage });
    this.fetchCars(this.currentPage);
    this.totalCarsCount = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.totalCars,
    });
    const controlContainer = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.controlContainer,
    });
    this.prevButton = new BaseComponent({
      parentNode: controlContainer,
      tag: 'button',
      className: styles.prevButton,
      content: 'Prev',
    });
    this.page = new BaseComponent({
      parentNode: controlContainer,
      tag: 'div',
      className: styles.page,
    });
    this.nextButton = new BaseComponent({
      parentNode: controlContainer,
      tag: 'button',
      className: styles.nextButton,
      content: 'Next',
    });
    this.garage = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.carsContainer,
    });
    this.addEventListeners();
    this.prevButton.disable();
  }

  addEventListeners() {
    this.prevButton.addListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.fetchCars(this.currentPage);
      }
    });

    this.nextButton.addListener('click', () => {
      this.currentPage += 1;
      this.fetchCars(this.currentPage);
    });
  }

  private async fetchCars(page: number) {
    try {
      const { cars, totalCount } = await Api.getAllCars(7, page);

      this.renderCars(cars);
      this.renderTotalCarsCount(totalCount);

      this.page.setContent(`${page}`);

      if (page === 1) {
        this.prevButton.disable();
      } else {
        this.prevButton.enable();
      }

      if (totalCount && Math.ceil(Number(totalCount) / 7) <= page) {
        this.nextButton.disable();
      } else {
        this.nextButton.enable();
      }

      this.setupEventListeners();
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private renderCars(cars: { id: number; name: string; color: string }[]) {
    this.garage.clear();
    cars.forEach((car) => {
      const carElement = new Car({
        parentNode: this.garage,
        car,
        events: {
          onSelectClick: () => {
            globalEventPipe.pub('carSelected', car);
          },
          onDeleteClick: async () => {
            await Api.deleteCar({ id: car.id });
            await this.fetchCars(this.currentPage);
            if (!this.garage.countChildren() && this.currentPage > 1) {
              this.currentPage -= 1;
              this.fetchCars(this.currentPage);
            }
          },
          onStartClick: async () => {
            try {
              const engineData = await Api.controlEngine(car.id, 'started');
              const time = Math.round(engineData.distance / engineData.velocity);
              globalEventPipe.pub('time', car.id, time);
              const driveData = await Api.switchToDriveMode(car.id);
              console.log(driveData);
            } catch (cause) {
              globalEventPipe.pub('break-engine', car.id);
              const error = new Error('Click handler failed', { cause });
              console.error(error);
            }
          },
          onStopClick: async () => {
            try {
              await Api.controlEngine(car.id, 'stopped');
            } catch (error) {
              console.error('Failed STOP:', error);
            }
          },
        },
      });
      return { carElement };
    });
  }

  private renderTotalCarsCount(totalCount: string | null) {
    this.totalCarsCount.setContent(`Garage (${totalCount})`);
  }

  private setupEventListeners() {
    globalEventPipe.sub('carCreated', () => {
      this.fetchCars(this.currentPage);
    });
    globalEventPipe.sub('carUpdated', () => {
      this.fetchCars(this.currentPage);
    });
    globalEventPipe.sub('carsCreated', () => {
      this.currentPage = 1;
      this.fetchCars(this.currentPage);
    });
    globalEventPipe.sub('carCleared', () => {
      this.currentPage = 1;
      this.fetchCars(this.currentPage);
    });
  }
}

export { GarageContainer };
