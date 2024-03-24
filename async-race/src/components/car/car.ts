import BaseComponent from '../../utils/base-component';
import './car.module.css';

export default class Car extends BaseComponent {
  constructor() {
    super({
      tag: 'div',
      className: 'car',
    });
  }
}
