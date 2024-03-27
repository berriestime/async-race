import BaseComponent from '../../utils/base-component';
import styles from './delete-button.module.css';

class DeleteButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: styles.deleteButton, content: 'Remove Car' });
    this.addListener('click', onClick);
  }
}

export { DeleteButton };
