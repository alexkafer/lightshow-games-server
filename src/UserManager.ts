import EventEmitter from 'events';

import User from './utils/User';
import SocketIO from "socket.io";
import GameServer from './GameServer';

import logger from './utils/Logger'

export default class UserManager extends EventEmitter {
    private users: Map<string, User>;
    private io: SocketIO.Server;

    constructor(gs: GameServer) {
        super();

        this.users = new Map();

        this.io = SocketIO(gs.getHTTPServer());
        this.io.on('connection', this.userConnection.bind(this));
    }

    private userConnection(socket: any) {
        logger.debug('a user connected');
        socket.join('users');

        this.addUser(socket);

        socket.on('disconnect', () => {
            logger.debug('user disconnected');
            this.disconnectUser(socket);
        });
    }

    public addUser(socket: SocketIO.Socket) {
        const user = new User(socket);
        this.users.set(socket.id, user);
        logger.http("[CONNECTED] User with id: " + socket.id);
        this.emit("userJoined", user);
    }

    public disconnectUser(socket: SocketIO.Socket) {
        logger.http("[DISCONNECTED] User with id: " + socket.id);
        this.emit("userLeft", this.users.get(socket.id));
        this.users.delete(socket.id);
    }
}