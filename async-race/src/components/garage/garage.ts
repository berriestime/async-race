import BaseComponent from '../../utils/base-component';
import { Api } from '../../api/api';
import styles from './garage.module.css';
import { Car } from '../car/car';
import { globalEventPipe } from '../../utils/event-emitter';

class GarageContainer extends BaseComponent {
  garage: BaseComponent;

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ parentNode, tag: 'div', className: styles.garage, content: 'Garage( )' });

    this.garage = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.carsContainer,
    });

    this.fetchCars();
  }

  private async fetchCars() {
    const cars = await Api.getAllCars();
    this.renderCars(cars);
    globalEventPipe.sub('carCreated', () => {
      this.fetchCars();
    });
    globalEventPipe.sub('carUpdated', () => {
      this.fetchCars();
    });
    globalEventPipe.sub('carsCreated', () => {
      this.fetchCars();
    });
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
      });
      return { carElement };
    });
  }
}

export { GarageContainer };
