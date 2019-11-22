import SocketIO from "socket.io";
import GameServer from "./GameServer";
import { throwStatement } from "babel-types";

export default class LightShow {
    private gallium: SocketIO.Server;

    constructor(private gs: GameServer) {
        this.gallium = SocketIO(gs.getHTTPServer(), {
            path: '/gallium'
        });

        this.gallium.use((socket, next) => {
            const token = socket.handshake.query.token;
            if (token === "lightshow2") {
                return next();
            }
            return next(new Error('authentication error'));
        });

        this.gallium.on('connection', this.userConnection.bind(this));
    }

    private userConnection(socket: any) {
        console.log('gallium connected');
        socket.join('gallium');

        socket.on('disconnect', () => {
            console.log('gallium disconnected');
        });
    }

    public sendFrame(event: string, payload: number[]) {
        return this.gallium.emit('frame', payload);
    }

    public allOn() {
        console.debug("Turning all lights on");
        return this.gallium.emit('allOn');
    }

    public allOff() {
        console.debug("Turning all lights off")
        return this.gallium.emit('allOff');
    }
}