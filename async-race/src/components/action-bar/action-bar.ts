import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import { Car } from '../car/car';
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

    generate.addListener('click', this.handleGenerateClick.bind(this));
  }

  private async handleGenerateClick() {
    for (let i = 0; i < 100; i += 1) {
      const name = this.generateRandomName();
      const color = this.generateRandomColor();

      await CreateForm.createNewCar(name, color); // Create new car using CreateForm
    }
    globalEventPipe.pub('carsCreated');
  }

  private generateRandomName(): string {
    return Math.random().toString(36).substring(7); // Generate random name
  }

  private generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16); // Generate random color
  }
}

export { ActionBar };
