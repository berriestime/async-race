import BaseComponent from '../../utils/base-component';
import styles from './start-button.module.css';

class StartButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: styles.startButton, content: 'A' });
    this.addListener('click', onClick);
  }
}

export { StartButton };
