import logger from "./utils/Logger";

import GameServer from "./GameServer";
import Layout from "./utils/Layout";
import Light from "./utils/Light";

import SocketIO from "socket.io";

export default class LightShow {
    private gallium: SocketIO.Server;

    private frameQueue: number[];
    private frame: number[];

    constructor(private layout: Layout, gs: GameServer) {
        this.gallium = SocketIO(gs.getHTTPServer(), {
            path: '/gallium',
        });

        this.gallium.use((socket, next) => {
            const token = socket.handshake.query.token;
            if (token === "lightshow2") {
                return next();
            }
            return next(new Error('authentication error'));
        });

        this.gallium.on('connection', this.galliumConnection.bind(this));

        this.frameQueue = new Array<number>(512);
        this.frameQueue.fill(-1);

        this.frame = new Array<number>(512);
        this.frame.fill(0);

        // Technically the max update is 44Hz, or 23ms.
        // Due to the network, we're running at 20 Hz, or 50ms
        // Every 5 seconds send a keyframe. The others can just be updates
        let count = 0;
        setInterval(() => {
            if (count > 100) {
                this.emitKeyframe();
                count = 0;
            } else {
                this.emitUpdates();
                count += 1;
            }
        }, 50);
    }

    public uniformAdd(amount: number) {
        for (let i = 0; i < 512; i++) {
            this.addToChannel(i, amount);
        }
    }

    public setChannel(channel: number, value: number) {
        if (channel < 0 || channel >= 512) {
            logger.error("Trying to set channel out of range.");
            return;
        }

        // Clamp to avoid overflow errors
        const newValue = Math.min(Math.max(value, 0), 255);

         // If the value changed, update the frame and add to updates queue
        if (newValue !== this.frame[channel]) {
            this.frameQueue[channel] = this.frame[channel] = newValue;
        }
    }

    public addToChannel(channel: number, value: number) {
        this.setChannel(channel, this.frame[channel] + value);
    }

    private galliumConnection(socket: any) {
        logger.debug('gallium connected')
        socket.join('gallium');

        socket.emit('frame', Object.assign({}, this.frame));

        socket.on('disconnect', () => {
            logger.debug('gallium disconnected');
        });
    }

    private emitKeyframe() {
        // Don't need to send it as an update if we're already sending the whole thing
        this.frameQueue.fill(-1);
        this.gallium.emit('frame', Object.assign({}, this.frame));
    }

    private emitUpdates() {
        const payload: { [key: number]: number; } = {};

        for (let i = 0; i < 512; i++) {
            if (this.frameQueue[i] > -1) {
                payload[i] = this.frameQueue[i];
                this.frameQueue[i] = -1;
            }
        }

        const changes = Object.keys(payload).length;
        if (changes > 0) {
            logger.debug("Sending payload with " + changes + " updates");
            this.gallium.emit('frame', payload);
        }
    }

    public allOn() {
        logger.debug("Turning all lights on");

        // Updating internal frame for future updates
        this.frame.fill(255);
        this.gallium.emit('allOn');
    }

    public allOff() {
        logger.debug("Turning all lights off")

        // Updating internal frame for future updates
        this.frame.fill(0);
        this.gallium.emit('allOff');
    }

    public getLights(): Light[] {
        return this.layout.getLights();
    }
}