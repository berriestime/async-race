import { Api } from '../../api/api';
import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';
import { UpdateButton } from '../update-button/update-button';

class UpdateForm extends BaseComponent {
  carName: BaseComponent;

  carColor: BaseComponent;

  formButton: UpdateButton;

  selectedCarId: number | null = null;

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ parentNode, tag: 'div', className: 'updateForm' });

    this.carName = new BaseComponent({ parentNode: this, tag: 'input', className: 'input' });
    this.carColor = new BaseComponent({ parentNode: this, tag: 'input', className: 'input' });
    this.carColor.setAttributes({ type: 'color' });
    this.formButton = new UpdateButton({
      parentNode: this,
      onClick: this.handleUpdateClick.bind(this),
    });
    this.formButton.setAttributes({ disabled: 'disabled' });
    globalEventPipe.sub('carSelected', this.handleCarSelected.bind(this));
  }

  handleUpdateClick() {
    if (!this.selectedCarId) {
      return;
    }
    Api.updateCar({
      id: this.selectedCarId,
      name: this.carName.value,
      color: this.carColor.value,
    }).then((car) => {
      globalEventPipe.pub('carUpdated', car);
      this.carName.setValue('');
      this.carColor.setValue('#000000');
      this.selectedCarId = null;
      this.formButton.setAttributes({ disabled: 'disabled' });
    });
  }

  handleCarSelected(selectedCar: { id: number; name: string; color: string }) {
    this.selectedCarId = selectedCar.id;
    this.carName.setValue(selectedCar.name);
    this.carColor.setValue(selectedCar.color);
    this.formButton.removeAttributes('disabled');
  }
}

export { UpdateForm };
