type EventHandler<T = unknown> = (...args: T[]) => void;

class EventPipe {
  private eventHandlers: { [eventName: string]: EventHandler[] };

  constructor() {
    this.eventHandlers = {};
  }

  sub<T>(eventName: string, eventHandler: T): () => void {
    this.eventHandlers[eventName] ??= [];
    this.eventHandlers[eventName].push(eventHandler as EventHandler);

    return () => {
      this.removeHandler(eventName, eventHandler);
    };
  }

  removeHandler<T>(eventName: string, eventHandler: T): void {
    const handlers = this.eventHandlers[eventName];
    if (handlers) {
      const index = handlers.indexOf(eventHandler as EventHandler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  removeAllHandlers(eventName: string): void {
    delete this.eventHandlers[eventName];
  }

  implode(filter: string[] = []) {
    Object.keys(this.eventHandlers).forEach((key) => {
      if (filter.includes(key)) return;
      delete this.eventHandlers[key];
    });
  }

  pub(eventName: string): void;
  pub<T0>(eventName: string, arg0: T0): void;
  pub<T0, T1>(eventName: string, arg0: T0, arg1: T1): void;
  pub<T0, T1, T2>(eventName: string, arg0: T0, arg1: T1, arg2: T2): void;
  pub(eventName: string, ...args: unknown[]): void {
    const handlers = this.eventHandlers[eventName];
    if (handlers) {
      handlers.slice().forEach((handler) => {
        handler(...args);
      });
    }
  }
}

const globalEventPipe = new EventPipe();

export { globalEventPipe };
