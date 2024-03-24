import { Api } from '../api/api';
import { CreateForm } from '../components/create-form/create-form';
import BaseComponent from '../utils/base-component';
import styles from './garage.module.css';

class Garage extends BaseComponent {
  createForm: CreateForm;

  constructor() {
    super({ parentNode: document.body, tag: 'div', className: styles.pageContainer });
    this.createForm = new CreateForm({ parentNode: this });
  }

  static async createNewCar(name: string, color: string) {
    try {
      const newCarData = { name, color };
      const newCar = await Api.createCar(newCarData);
      console.log(newCar);
    } catch (error) {
      console.error('Error in createNewCar:', error);
    }
  }
}

const initGarage = () => {
  const garage = new Garage();
  return garage;
};

export { initGarage };
