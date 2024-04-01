import BaseComponent from '../../utils/base-component';
import { globalEventPipe } from '../../utils/event-emitter';

class WinnerCheck extends BaseComponent {
  private raceStarted = false;

  private winnerId: number | null = null;

  private time = 0;

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ tag: 'div', className: 'winner-check', parentNode });
    globalEventPipe.sub('race-start', () => {
      this.raceStarted = true;
      this.winnerId = null;
      this.time = 0;
    });
    globalEventPipe.sub('race-finished', (id: number, time: number) => {
      if (this.raceStarted && !this.winnerId) {
        this.winnerId = id;
        this.time = time;
        console.log(`Winner:', ${this.winnerId}, ${this.time}ms`);
        globalEventPipe.pub('race-winner', id, time);
      }
    });
  }
}

export { WinnerCheck };
