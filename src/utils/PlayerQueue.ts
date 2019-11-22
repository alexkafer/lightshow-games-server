import User from './User'

import logger from './Logger'

export default class PlayerQueue {
    private _queue: User[] = [];

    push(user: User) {
      logger.debug(user + ' added to queue.');
      this.updateUser(user, this._queue.push(user));
    }

    pop(): User | undefined {
      const user = this._queue.shift();
      logger.debug(user + ' removed from queue.');
      if (user !== undefined)
        this.updatePositions();
      return user;
    }

    remove(user: User): boolean {
      logger.debug(user.currentSocket.id + ' removed from queue.');
      const index = this._queue.indexOf(user, 0);
      if (index > -1) {
        this._queue.splice(index, 1);
        this.updatePositions(index);
        this.updateUser(user, -1);
        return true;
      }

      return false;
    }

    isNext(user: User): boolean {
      return this.length() > 0 && user === this._queue[0];
    }

    length(): number {
      return this._queue.length;
    }

    private updatePositions(after: number = 0) {
      for (let index = after; index < this.length(); index++) {
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