import BaseComponent from '../../utils/base-component';
import { Api } from '../../api/api';
import styles from './garage.module.css';
import { Car } from '../car/car';
import { DeleteButton } from '../delete-button/delete-button';
import { globalEventPipe } from '../../utils/event-emitter';
import { SelectButton } from '../select-car/select-car';

class GarageContainer extends BaseComponent {
  cars: BaseComponent;

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ parentNode, tag: 'div', className: styles.garage, content: 'Garage( )' });

    this.cars = new BaseComponent({
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
  }

  private renderCars(cars: { id: number; name: string; color: string }[]) {
    this.cars.clear();
    cars.forEach((car) => {
      const carElement = new Car({ parentNode: this.cars });
      carElement.addClass(styles.car);
      carElement.setContent(`${car.id} - ${car.name} - ${car.color}`);
      this.cars.append(carElement);
      const selectCar = new SelectButton({
        parentNode: carElement,
        onClick: () => {
          globalEventPipe.pub('carSelected', car);
        },
      });
      const removeCar = new DeleteButton({
        parentNode: carElement,
        onClick: async () => {
          await Api.deleteCar({ id: car.id });
          this.fetchCars();
        },
      });
      return { selectCar, removeCar };
    });
  }
}

export { GarageContainer };
