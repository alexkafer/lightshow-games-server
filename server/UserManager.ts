import EventEmitter from 'events';

import User from './utils/User';
import SocketIO from "socket.io";
import GameServer from './GameServer';

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
        console.log('a user connected');
        socket.join('users');

        this.addUser(socket);

        socket.on('disconnect', () => {
            console.log('user disconnected');
            this.disconnectUser(socket);
        });
    }

    public addUser(socket: SocketIO.Socket) {
        const user = new User(socket);
        this.users.set(socket.id, user);
        this.emit("userJoined", user);
        console.debug("User joined!");
    }

    public disconnectUser(socket: SocketIO.Socket) {
        this.emit("userLeft", this.users.get(socket.id));
        this.users.delete(socket.id);
        console.debug("User left.");
    }
}