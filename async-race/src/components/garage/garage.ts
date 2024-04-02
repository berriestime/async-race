import BaseComponent from '../../utils/base-component';
import { Api } from '../../api/api';
import styles from './garage.module.css';
import { Car } from '../car/car';
import { globalEventPipe } from '../../utils/event-emitter';
import { WinnerCheck } from '../winner-check/winner-check';
import { WinnerModal } from '../winner-modal/winner-modal';

class GarageContainer extends BaseComponent {
  garage: BaseComponent;

  totalCarsCount: BaseComponent;

  prevButton: BaseComponent;

  nextButton: BaseComponent;

  page: BaseComponent;

  engineStatus: { [key: number]: 'started' | 'stopped' } = {};

  currentPage: number = 1;

  winner: WinnerCheck;

  winnerModal: WinnerModal | null = null;

  mutationObserver: MutationObserver | null = null;

  constructor({ parentNode }: { parentNode: BaseComponent }) {
    super({ parentNode, tag: 'div', className: styles.garage });
    this.fetchCars(this.currentPage);
    this.totalCarsCount = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.totalCars,
    });
    const controlContainer = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.controlContainer,
    });
    this.prevButton = new BaseComponent({
      parentNode: controlContainer,
      tag: 'button',
      className: styles.prevButton,
      content: 'Prev',
    });
    this.page = new BaseComponent({
      parentNode: controlContainer,
      tag: 'div',
      className: styles.page,
    });
    this.nextButton = new BaseComponent({
      parentNode: controlContainer,
      tag: 'button',
      className: styles.nextButton,
      content: 'Next',
    });
    this.garage = new BaseComponent({
      parentNode: this,
      tag: 'div',
      className: styles.carsContainer,
    });
    this.addEventListeners();
    this.prevButton.disable();
    this.winner = new WinnerCheck({ parentNode: this });
  }

  addEventListeners() {
    this.prevButton.addListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.fetchCars(this.currentPage);
      }
    });

    this.nextButton.addListener('click', () => {
      this.currentPage += 1;
      this.fetchCars(this.currentPage);
    });
  }

  private async fetchCars(page: number) {
    try {
      const { cars, totalCount } = await Api.getAllCars(7, page);

      this.renderCars(cars);
      this.renderTotalCarsCount(totalCount);

      this.page.setContent(`${page}`);

      if (page === 1) {
        this.prevButton.disable();
      } else {
        this.prevButton.enable();
      }

      if (totalCount && Math.ceil(Number(totalCount) / 7) <= page) {
        this.nextButton.disable();
      } else {
        this.nextButton.enable();
      }

      this.setupEventListeners();
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private renderCars(cars: { id: number; name: string; color: string }[]) {
    this.garage.clear();
    this.mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement && 'component' in node) {
            (node as { component: BaseComponent }).component.cleanup();
          }
        });
      });
    });
    this.mutationObserver.observe(this.garage.node, { childList: true });
    // eslint-disable-next-line max-lines-per-function
    cars.forEach((car) => {
      let controller = new AbortController();
      let { signal } = controller;
      const carElement = new Car({
        parentNode: this.garage,
        car,
        events: {
          onSelectClick: () => {
            globalEventPipe.pub('carSelected', car);
          },
          onDeleteClick: async () => {
            try {
              await Api.deleteCar({ id: car.id });
              try {
                await Api.deleteWinner(car.id);
              } catch {
                // no action needed
              }
              await this.fetchCars(this.currentPage);
              if (!this.garage.countChildren() && this.currentPage > 1) {
                this.currentPage -= 1;
                await this.fetchCars(this.currentPage);
              }
            } catch {
              // no action needed
            }
          },
          onStartClick: async () => {
            controller = new AbortController();
            signal = controller.signal;
            try {
              const engineData = await Api.controlEngine(car.id, 'started', signal);
              if (!engineData) return;
              const time = Math.round(engineData.distance / engineData.velocity);
              globalEventPipe.pub('time', car.id, time);
              const driveData = await Api.switchToDriveMode(car.id, signal);
              if (!driveData) return;
              globalEventPipe.pub('race-finished', car.id, time);
            } catch (cause) {
              globalEventPipe.pub('break-engine', car.id);
            }
          },
          onStopClick: async () => {
            controller.abort('stop requrested');
            await Api.controlEngine(car.id, 'stopped');
          },
        },
      });
      return { carElement };
    });
  }

  private renderTotalCarsCount(totalCount: string | null) {
    this.totalCarsCount.setContent(`Garage (${totalCount})`);
  }

  private renderModal(id: number, time: number, name: string) {
    this.winnerModal = new WinnerModal({ parentNode: this, id, name, time });
  }

  static async assignWinner(id: number, time: number) {
    const winner = await Api.getWinner(id).catch(() => {});
    if (winner) await Api.updateWinner(id, winner.wins + 1, Math.min(winner.time, time));
    else await Api.createWinner(id, time);
  }

  private setupEventListeners() {
    globalEventPipe.sub('carCreated', () => {
      this.fetchCars(this.currentPage);
    });
    globalEventPipe.sub('carUpdated', () => {
      this.fetchCars(this.currentPage);
    });
    globalEventPipe.sub('carsCreated', () => {
      this.currentPage = 1;
      this.fetchCars(this.currentPage);
    });
    globalEventPipe.sub('carCleared', () => {
      this.currentPage = 1;
      this.fetchCars(this.currentPage);
    });
    globalEventPipe.sub('race-winner', async (id: number, time: number) => {
      await GarageContainer.assignWinner(id, time);
      const car = await Api.getCar(id);
      this.renderModal(id, time, car.name);
    });
  }
}

export { GarageContainer };
