import BaseComponent from '../../utils/base-component';
import styles from './winner-modal.module.css';

class WinnerModal extends BaseComponent {
  backdrop: BaseComponent;

  modalContainer: BaseComponent;

  id: number;

  time: number;

  constructor({ parentNode, id, time }: { parentNode: BaseComponent; id: number; time: number }) {
    super({ parentNode, tag: 'div' });

    this.id = id;
    this.time = time;
    this.backdrop = new BaseComponent({ parentNode: this, tag: 'div', className: styles.backdrop });
    this.modalContainer = new BaseComponent({
      parentNode: this.backdrop,
      tag: 'div',
      className: styles.modalContainer,
      content: `Winner: ${id} ${time}`,
    });

    this.backdrop.addListener('click', () => {
      this.removes();
    });
  }
}

export { WinnerModal };
