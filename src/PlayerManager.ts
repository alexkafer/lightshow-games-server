import logger from './utils/Logger';

import EventEmitter from 'events';
import SocketIO from "socket.io";

import {SlottedQueue} from './utils/SlottedQueue';
import Player from './games/Player';
import GameServer from './GameServer';



export default class PlayerManager extends EventEmitter {
    private visitors: Map<string, Player>;
    private players: Map<string, Player>;
    private queue: SlottedQueue<Player>;

    private io: SocketIO.Server;
    private admin: SocketIO.Server;

    constructor(gs: GameServer) {
        super();

        this.visitors = new Map();
        this.players = new Map();
        this.queue = new SlottedQueue();

        this.io = SocketIO(gs.getServer());
        this.io.on('connection', this.userConnection.bind(this));

        this.admin = SocketIO(gs.getServer(), {
            path: '/admin',
        });
        this.admin.on('connection', this.adminConnection.bind(this));
    }

    public kickPlayers() {
        // Clear the open slots
        this.queue.clearSlots();

        // Transfer any current players to the queue
        this.getPlayers().map((player: Player) => {
            player.currentSocket.emit('ended');
            this.queue.push(player)
        });
    }

    public createSlots(slots: number) {
        if (slots < 0 || slots === Infinity) {
            logger.error("Cannot create " + slots + " slots.");
            return;
        }

        logger.info("Creating " + slots + " slots.");
        for (let i = 0; i < slots; i++) {
            this.fillPlayer();
        }
    }

    private async fillPlayer() {
        logger.info('Asking for player');
        const newPlayer = await this.queue.getNextPlayer();
        this.makePlayer(newPlayer.currentSocket.id);
        logger.info('Player added');

        // Allow the user to manually end the game
        newPlayer.currentSocket.on("end", () => {
            this.removePlayer(newPlayer.currentSocket.id);
        });
    }

    public getPlayers(): Player[] {
        return Array.from(this.players.values())
    }

    public isPlayer(id: string): boolean {
        return this.players.has(id);
    }

    private makePlayer(id: string) {
        if (this.visitors.has(id)) {
            const player = this.visitors.get(id);
            this.players.set(id, player);
            this.emit("playerStarted", player);
            player.currentSocket.emit('started');
        }
    }

    public removePlayer(id: string) {
        if (this.players.delete(id)) {
            this.fillPlayer();
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

    public notifyGameUpdate(game: string) {
        this.io.emit("game", game);
        this.admin.emit("game", game);
    }

    private userConnection(socket: any) {
        logger.debug('a user connected');

        this.newVisitor(socket);

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

    private newVisitor(socket: SocketIO.Socket) {
        const visitor = new Player(socket);
        this.visitors.set(socket.id, visitor);
        logger.http("[CONNECTED] User with id: " + socket.id);
        this.emit("visitorJoined", visitor);

        socket.on("join", () => {
            this.queue.push(visitor);
        });

        socket.on("cancel", () => {
            this.queue.remove(visitor);
        });
    }

    public disconnectUser(socket: SocketIO.Socket) {
        logger.http("[DISCONNECTED] User with id: " + socket.id);

        this.removePlayer(socket.id);
        this.queue.remove(this.visitors.get(socket.id));
        this.visitors.delete(socket.id);
    }
}