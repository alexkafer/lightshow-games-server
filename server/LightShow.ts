import SocketIO from "socket.io";
import GameServer from "./GameServer";

export default class LightShow {
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
    }

    private gallium: SocketIO.Server;

    public connect(gallium: SocketIO.Server) {
        this.gallium = gallium;
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