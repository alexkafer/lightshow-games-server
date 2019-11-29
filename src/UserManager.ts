import EventEmitter from 'events';

import User from './utils/User';
import SocketIO from "socket.io";
import GameServer from './GameServer';

import logger from './utils/Logger'

export default class UserManager extends EventEmitter {
    private visitors: Map<string, User>;
    private players: Map<string, User>;

    private io: SocketIO.Server;
    private admin: SocketIO.Server;

    constructor(gs: GameServer) {
        super();

        this.visitors = new Map();
        this.players = new Map();

        this.io = SocketIO(gs.getHTTPServer());
        this.io.on('connection', this.userConnection.bind(this));

        this.admin = SocketIO(gs.getHTTPServer(), {
            path: '/admin',
        });
    }

    public getPlayers(): User[] {
        return Array.from(this.players.values())
    }

    public numPlayers() {
        return this.players.size;
    }

    public addPlayer(user: User) {
        this.players.set(user.currentSocket.id, user);
    }

    public removePlayer(user: User) {
        if (this.players.has(user.currentSocket.id)) {
            this.players.delete(user.currentSocket.id);
        }
    }

    public updateAdmin() {
        this.admin.emit("players", this.getPlayers().map((u: User) => {
            return {
                position: u.getPosition(),
                direction: u.getDirection()
            }
        }))
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

    public notifyGameUpdate(game: string) {
        this.io.emit("game", game);
    }

    public addUser(socket: SocketIO.Socket) {
        const user = new User(socket);
        this.visitors.set(socket.id, user);
        logger.http("[CONNECTED] User with id: " + socket.id);
        this.emit("userJoined", user);
    }

    public disconnectUser(socket: SocketIO.Socket) {
        logger.http("[DISCONNECTED] User with id: " + socket.id);
        this.emit("userLeft", this.visitors.get(socket.id));
        this.visitors.delete(socket.id);
    }
}