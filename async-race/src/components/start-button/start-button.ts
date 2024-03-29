import BaseComponent from '../../utils/base-component';

class StartButton extends BaseComponent {
  constructor({ parentNode, onClick }: { parentNode: BaseComponent; onClick: () => void }) {
    super({ parentNode, tag: 'button', className: 'startButton', content: 'A' });
    this.addListener('click', onClick);
  }
}

export { StartButton };
