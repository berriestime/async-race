import BaseComponent from '../../utils/base-component';
import { Api } from '../../api/api';
import styles from './garage.module.css';
import { Car } from '../car/car';
import { globalEventPipe } from '../../utils/event-emitter';

class GarageContainer extends BaseComponent {
  garage: BaseComponent;

  totalCarsCount: BaseComponent;

  engineStatus: { [key: number]: 'started' | 'stopped' } = {};

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ parentNode, tag: 'div', className: styles.garage });

    this.totalCarsCount = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.totalCars,
    });

    this.garage = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.carsContainer,
    });

    this.fetchCars();
  }

  private async fetchCars() {
    try {
      const { cars, totalCount } = await Api.getAllCars(10);

      this.renderCars(cars);
      this.renderTotalCarsCount(totalCount);
      this.setupEventListeners();
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }

  private renderCars(cars: { id: number; name: string; color: string }[]) {
    this.garage.clear();
    cars.forEach((car) => {
      const carElement = new Car({
        parentNode: this.garage,
        car,
        onSelectClick: () => {
          globalEventPipe.pub('carSelected', car);
        },
        onDeleteClick: async () => {
          await Api.deleteCar({ id: car.id });
          this.fetchCars();
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
      });
      return { carElement };
    });
  }

  private renderTotalCarsCount(totalCount: string | null) {
    this.totalCarsCount.setContent(`Garage (${totalCount})`);
  }

  private setupEventListeners() {
    globalEventPipe.sub('carCreated', () => {
      this.fetchCars();
    });
    globalEventPipe.sub('carUpdated', () => {
      this.fetchCars();
    });
    globalEventPipe.sub('carsCreated', () => {
      this.fetchCars();
    });
    globalEventPipe.sub('carCleared', () => {
      this.fetchCars();
    });
  }
}

export { GarageContainer };
