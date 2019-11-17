import User from './utils/User';

export interface IUserDelegate {
    onNewUser(user: User): void;
    onUserLeft(user: User): void;
  }

export default class UserManager {
    private _delegate: IUserDelegate;
    users: Map<string, User>;

    constructor(delegate: IUserDelegate) {
        this._delegate = delegate;
        this.users = new Map();
    }

    public addUser(socket: SocketIO.Socket) {
        const user = new User(socket);
        this.users.set(socket.id, user);
        this._delegate.onNewUser(user);
    }

    public disconnectUser(socket: SocketIO.Socket) {
        this._delegate.onUserLeft(this.users.get(socket.id));
        this.users.delete(socket.id);
    }
}