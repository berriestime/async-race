import BaseComponent from '../../utils/base-component';
import styles from './winner-modal.module.css';

class WinnerModal extends BaseComponent {
  backdrop: BaseComponent;

  modalContainer: BaseComponent;

  id: number;

  time: number;

  name: string;

  constructor({
    parentNode,
    id,
    time,
    name,
  }: {
    parentNode: BaseComponent;
    id: number;
    name: string;
    time: number;
  }) {
    super({ parentNode, tag: 'div' });

    this.name = name;
    this.id = id;
    this.time = time;
    this.backdrop = new BaseComponent({ parentNode: this, tag: 'div', className: styles.backdrop });
    this.modalContainer = new BaseComponent({
      parentNode: this.backdrop,
      tag: 'div',
      className: styles.modalContainer,
      content: `Winner: ${id} - Time: ${time / 1000}s ${name}`,
    });

    this.backdrop.addListener('click', () => {
      this.removes();
    });
    setTimeout(() => {
      this.removes();
    }, 2000);
  }
}

export { WinnerModal };
