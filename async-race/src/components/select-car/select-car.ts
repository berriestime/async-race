import BaseComponent from '../../utils/base-component';
import styles from './select-car.module.css';

class SelectButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: styles.selectButton, content: 'Select Car' });
    this.addListener('click', onClick);
  }
}

export { SelectButton };
