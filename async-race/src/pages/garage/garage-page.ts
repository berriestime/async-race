import { ActionBar } from '../../components/action-bar/action-bar';
import { CreateForm } from '../../components/create-form/create-form';
import { GarageContainer } from '../../components/garage/garage';
import { UpdateForm } from '../../components/update-form/update-form';
import BaseComponent from '../../utils/base-component';
import styles from './garage-page.module.css';

class Garage extends BaseComponent {
  createForm: CreateForm;

  updateForm: UpdateForm;

  garageContainer: GarageContainer;

  actionBar: ActionBar;

  actionBarContainer: BaseComponent;

  constructor(parentNode: BaseComponent) {
    super({ parentNode, tag: 'div', className: styles.pageContainer });
    this.actionBarContainer = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.actionBarContainer,
    });
    this.createForm = new CreateForm({ parentNode: this.actionBarContainer });
    this.updateForm = new UpdateForm({ parentNode: this.actionBarContainer });
    this.garageContainer = new GarageContainer({ parentNode: this });
    this.actionBar = new ActionBar({
      parentNode: this.actionBarContainer,
      garageContainer: this.garageContainer,
    });
  }
}

const initGarage = (parentNode: BaseComponent) => {
  const garage = new Garage(parentNode);
  return { garage };
};

export { initGarage };
