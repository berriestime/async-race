import BaseComponent from '../../utils/base-component';
import styles from './stop-button.module.css';

class StopButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: styles.stopButton, content: 'B' });
    this.addListener('click', onClick);
  }
}

export { StopButton };
