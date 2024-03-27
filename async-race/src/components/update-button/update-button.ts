import BaseComponent from '../../utils/base-component';
import styles from './update-button.module.css';

class UpdateButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: styles.updateButton, content: 'Update Car' });
    this.addListener('click', onClick);
  }
}

export { UpdateButton };
