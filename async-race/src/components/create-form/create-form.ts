import { Api } from '../../api/api';
import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import { FormButton } from '../form-button/form-button';

class CreateForm extends BaseComponent {
  carName: BaseComponent;

  carColor: BaseComponent;

  formButton: FormButton;

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ parentNode, tag: 'div', className: 'createForm' });

    this.carName = new BaseComponent({ parentNode: this, tag: 'input', className: 'input' });
    this.carColor = new BaseComponent({ parentNode: this, tag: 'input', className: 'input' });
    this.carColor.setAttributes({ type: 'color' });
    this.formButton = new FormButton({
      parentNode: this,
      onClick: this.handleCreateClick.bind(this),
    });
  }

  getCarName() {
    return this.carName.value;
  }

  getCarColor() {
    return this.carColor.value;
  }

  handleCreateClick() {
    const name = this.getCarName();
    const color = this.getCarColor();
    CreateForm.createNewCar(name, color).then((newCar) => {
      globalEventPipe.pub('carCreated', newCar);
    });
  }

  static async createNewCar(name: string, color: string) {
    try {
      const newCarData = { name, color };
      const newCar = await Api.createCar(newCarData);
    } catch (error) {
      console.error('Error in createNewCar:', error);
    }
  }
}

export { CreateForm };
