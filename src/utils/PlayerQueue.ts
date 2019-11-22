import User from './User'

import logger from './Logger'

export default class PlayerQueue {
    private _queue: User[] = [];
    private _slots: ((v: User) => void)[] = [];

    push(user: User) {
      logger.debug(user + ' arrived at queue.');

      // If we have open slots, resolve them
      if (this._slots.length > 0) {
        logger.info('Resolving slot');
        this._slots.shift()(user);
      } else {
        // Otherwise add to queue
        this.updateUser(user, this._queue.push(user));
      }
    }

    getNextPlayer(): Promise<User> {
      return new Promise<User>((resolve) => {
        if (this._queue.length > 0) {
          // If we have someone in line, return right away
          const user = this._queue.shift();
          logger.debug(user + ' instantly resolved from queue.');
          if (user !== undefined)
            this.updatePositions();
          resolve(user);
        } else {
          // Otherwise, wait until someone shows up
          logger.info('Opening player slot ', this._slots.push(resolve));
        }
      })
    }

    removeFromQueue(user: User): boolean {
      const index = this._queue.indexOf(user, 0);
      if (index > -1) {
        this._queue.splice(index, 1);
        logger.debug(user.currentSocket.id + ' removed from queue.');
        this.updatePositions(index);
        this.updateUser(user, -1);
        return true;
      }

      return false;
    }

    //  length(): number {
    //   return this._queue.length;
    // }

    private updatePositions(after: number = 0) {
      for (let index = after; index < this._queue.length; index++) {
        this.updateUser(this._queue[index], index + 1);
      }
    }

    private updateUser(user: User, position: number) {
      if (user.currentSocket.connected) {
        logger.http('Telling ' + user.currentSocket.id + " that they are now " + position + " in line");
        user.currentSocket.emit("queue", position);
      }
    }

}