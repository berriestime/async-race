import { CreateForm } from '../../components/create-form/create-form';
import { GarageContainer } from '../../components/garage/garage';
import { UpdateForm } from '../../components/update-form/update-form';
import BaseComponent from '../../utils/base-component';
import styles from './garage-page.module.css';

class Garage extends BaseComponent {
  createForm: CreateForm;

  updateForm: UpdateForm;

  garageContainer: GarageContainer;

  constructor() {
    super({ parentNode: document.body, tag: 'div', className: styles.pageContainer });
    this.createForm = new CreateForm({ parentNode: this });
    this.updateForm = new UpdateForm({ parentNode: this });
    this.garageContainer = new GarageContainer({ parentNode: this });
  }
}

const initGarage = () => {
  const garage = new Garage();
  return { garage };
};

export { initGarage };
