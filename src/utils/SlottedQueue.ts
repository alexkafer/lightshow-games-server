import logger from './Logger';
import EventEmitter from 'events';

export interface IQueueable {
  notifyPosition(position: number): void;
}

export class SlottedQueue<T extends IQueueable>  extends EventEmitter {
    private _queue: T[] = [];
    private _slots: ((v: T) => void)[] = [];

    push(user: T) {
      logger.debug('User arrived at queue.');
      // If we have open slots, resolve them
      if (this._slots.length > 0) {
        logger.info('Resolving slot');
        this._slots.shift()(user);
      } else {
        // Otherwise add to queue
        user.notifyPosition(this._queue.push(user));
      }
    }

    clearSlots() {
      this._slots = [];
    }

    length() {
      if (this._queue.length > 0) {
        return this._queue.length;
      } else {
        return -this._slots.length;
      }
    }

    getNextPlayer(): Promise<T> {
      return new Promise<T>((resolve) => {
        if (this._queue.length > 0) {
          // If we have someone in line, return right away
          const user = this._queue.shift();
          logger.debug(user + ' instantly resolved from queue.');
          if (user !== undefined)
            this.updatePositions();
          resolve(user);
        } else {
          // Otherwise, wait until someone shows up
          logger.info('Opening new player slot. ' + this._slots.push(resolve) + " total.");
        }
      })
    }

    remove(user: T): boolean {
      const index = this._queue.indexOf(user, 0);
      if (index > -1) {
        this._queue.splice(index, 1);
        logger.debug('Removed from queue.');
        this.updatePositions(index);
        return true;
      }

      return false;
    }
    
    private updatePositions(after: number = 0) {
      for (let index = after; index < this._queue.length; index++) {
        this._queue[index].notifyPosition( index + 1);
      }
    }
}