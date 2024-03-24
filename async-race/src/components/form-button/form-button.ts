import BaseComponent from '../../utils/base-component';
import styles from './form-button.module.css';

class FormButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: styles.formButton, content: 'Create Car' });
    this.addListener('click', onClick);
  }
}

export { FormButton };
