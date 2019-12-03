import EventEmitter from 'events';

import Player from './games/Player';
import SocketIO from "socket.io";
import GameServer from './GameServer';

import logger from './utils/Logger'

export default class PlayerManager extends EventEmitter {
    private visitors: Map<string, Player>;
    private players: Map<string, Player>;

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
        this.admin.on('connection', this.adminConnection.bind(this));
    }

    public getPlayers(): Player[] {
        return Array.from(this.players.values())
    }

    public numPlayers() {
        return this.players.size;
    }

    public addPlayer(user: Player) {
        this.players.set(user.currentSocket.id, user);
    }

    public removePlayer(user: Player) {
        if (this.players.has(user.currentSocket.id)) {
            this.players.delete(user.currentSocket.id);
        }
    }

    public updateAdmin() {
        this.admin.emit("players", this.getPlayers().map((u: Player) => {
            return {
                position: u.getPosition(),
                direction: u.getDirection(),
                id: u.currentSocket.id
            }
        }))
    }

    private userConnection(socket: any) {
        logger.debug('a user connected');

        this.addUser(socket);

        socket.on('disconnect', () => {
            logger.debug('user disconnected');
            this.disconnectUser(socket);
        });
    }

    private adminConnection(socket: any) {
        logger.debug('an admin connected');

        socket.on('disconnect', () => {
            logger.debug('admin disconnected');
        });
    }

    public notifyGameUpdate(game: string) {
        this.io.emit("game", game);
    }

    public addUser(socket: SocketIO.Socket) {
        const user = new Player(socket);
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