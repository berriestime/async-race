import { Api } from '../../api/api';
import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import { CreateForm } from '../create-form/create-form';

class ActionBar extends BaseComponent {
  garageContainer: BaseComponent;

  // eslint-disable-next-line max-lines-per-function
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
    const reset = new BaseComponent({
      parentNode: actionBar,
      tag: 'button',
      className: 'actionButton',
      content: 'Reset',
    });
    const generate = new BaseComponent({
      parentNode: actionBar,
      tag: 'button',
      className: 'actionButton',
      content: 'Generate',
    });
    const cleanGarage = new BaseComponent({
      parentNode: actionBar,
      tag: 'button',
      className: 'actionButton',
      content: 'Clean Garage',
    });

    cleanGarage.addListener('click', ActionBar.handleClearCarsClick.bind(this));
    generate.addListener('click', ActionBar.handleGenerateClick.bind(this));
    race.addListener('click', () => {
      globalEventPipe.pub('raceStart');
    });
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
      Toyota: ['Corolla', 'Camry', 'RAV4', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
      Nissan: ['Altima', 'Maxima', 'Rogue', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
      Ford: ['Fiesta', 'Mustang', 'Explorer', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'],
      BMW: ['M5', 'X3', 'X5', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'],
      Mercedes: ['A-Class', 'E-Class', 'S-Class', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'],
      Ferrari: ['488 Spider', 'Portofino', 'Roma', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'],
      Lamborghini: ['Aventador', 'Huracan', 'Urus', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'],
      Porsche: ['911', 'Cayman', 'Panamera', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'],
      Audi: ['A6', 'Q5', 'R8', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'],
      Volkswagen: ['Golf', 'Passat', 'Tiguan', 'K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7'],
      Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
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
