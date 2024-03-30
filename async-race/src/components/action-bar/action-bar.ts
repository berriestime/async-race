import { Api } from '../../api/api';
import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import { CreateForm } from '../create-form/create-form';

class ActionBar extends BaseComponent {
  garageContainer: BaseComponent;

  constructor({
    parentNode,
    garageContainer,
  }: {
    parentNode: BaseComponent;
    garageContainer: BaseComponent;
  }) {
    super({ parentNode, tag: 'div', className: 'actionBar' });
    this.garageContainer = garageContainer;

    const actionBar = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: 'actionBar',
    });
    const race = new BaseComponent({
      parentNode: actionBar,
      tag: 'button',
      className: 'actionButton',
      content: 'Race',
    });
    const cleanGarage = new BaseComponent({
      parentNode: actionBar,
      tag: 'button',
      className: 'actionButton',
      content: 'Clean Garage',
    });
    const generate = new BaseComponent({
      parentNode: actionBar,
      tag: 'button',
      className: 'actionButton',
      content: 'Generate',
    });

    cleanGarage.addListener('click', ActionBar.handleClearCarsClick.bind(this));
    generate.addListener('click', ActionBar.handleGenerateClick.bind(this));
  }

  static async handleClearCarsClick() {
    await Api.deleteAllCars();
    globalEventPipe.pub('carCleared');
  }

  static async handleGenerateClick() {
    const promises: Promise<void>[] = [];

    for (let i = 0; i < 100; i += 1) {
      const name = ActionBar.generateRandomCar();
      const color = ActionBar.generateRandomColor();

      promises.push(CreateForm.createNewCar(name, color));
    }

    await Promise.all(promises);
    globalEventPipe.pub('carsCreated');
  }

  static generateRandomCar(): string {
    const cars: { [key: string]: string[] } = {
      Toyota: ['Corolla', 'Camry', 'RAV4'],
      Nissan: ['Altima', 'Maxima', 'Rogue'],
      Ford: ['Fiesta', 'Mustang', 'Explorer'],
      BMW: ['M5', 'X3', 'X5'],
      Mercedes: ['A-Class', 'E-Class', 'S-Class'],
      Ferrari: ['488 Spider', 'Portofino', 'Roma'],
      Lamborghini: ['Aventador', 'Huracan', 'Urus'],
      Porsche: ['911', 'Cayman', 'Panamera'],
      Audi: ['A6', 'Q5', 'R8'],
      Volkswagen: ['Golf', 'Passat', 'Tiguan'],
      Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y'],
    };

    const brands = Object.keys(cars);
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = cars[brand][Math.floor(Math.random() * cars[brand].length)];

    return `${brand} ${model}`;
  }

  static generateRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
}

export { ActionBar };
