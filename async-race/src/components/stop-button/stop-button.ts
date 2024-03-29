import BaseComponent from '../../utils/base-component';

class StopButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: 'stopButton', content: 'B' });
    this.addListener('click', onClick);
  }
}

export { StopButton };
