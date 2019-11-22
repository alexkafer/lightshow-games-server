import User from './User';

export default class PlayerQueue {
    private _queue: User[] = [];

    push(user: User) {
      this._queue.push(user);
      this.updatePositions()
    }

    pop(): User | undefined {
      const user = this._queue.shift();
      if (user !== undefined)
        this.updatePositions();
      return user;
    }

    remove(user: User) {
      const index = this._queue.indexOf(user, 0);
      if (index > -1) {
        this._queue.splice(index, 1);
        this.updatePositions();
      }
    }

    isNext(user: User): boolean {
      return this.length() > 0 && user === this._queue[0];
    }

    length(): number {
      return this._queue.length;
    }

    private updatePositions() {
      this._queue.forEach((user: User, index) => {
          if (user && user.currentSocket.connected) {
            user.currentSocket.emit("queue", index+1)
          }
      });
    }

}