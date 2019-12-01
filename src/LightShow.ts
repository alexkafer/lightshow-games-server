import logger from "./utils/Logger";

import GameServer from "./GameServer";
import Layout from "./utils/Layout";
import Light from "./utils/Light";

import SocketIO from "socket.io";

const NO_UPDATE: number = -1;

export default class LightShow {
    public static readonly FRAME_RATE = 50;
    public static readonly KEYFRAME_COUNT = 100;

    private gallium: SocketIO.Server;

    private frameQueue: number[];
    private frame: number[];

    constructor(public layout: Layout, gs: GameServer) {
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

        // The frame queue are the next lights to update.
        // -1 is no update, 0 or positive is a value.
        this.frameQueue = new Array<number>(512);
        this.frameQueue.fill(NO_UPDATE);

        // The frame is what we currently expect the light show to be displaying
        this.frame = new Array<number>(512);
        this.frame.fill(0);

        this.start();
    }

    public uniformAdd(amount: number) {
        for (let i = 0; i < 512; i++) {
            this.addToChannel(i, amount);
        }
    }

    public setChannel(channel: number, value: number) {
        this.queueUpdate(channel, value);
    }

    public addToChannel(channel: number, value: number) {
        this.setChannel(channel, this.frame[channel] + value);
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

    /** Update Management */
    private start() {
        // Technically the max update is 44Hz, or 23ms.
        // Due to the network, we're running at 20 Hz, or 50ms
        // Every 5 seconds send a keyframe. The others can just be updates
        let count = 0;
        setInterval(() => {
            if (count > LightShow.KEYFRAME_COUNT) {
                this.emitKeyframe();
                count = 0;
            } else {
                this.emitUpdates();
                count += 1;
            }
        }, LightShow.FRAME_RATE);
    }

    private galliumConnection(socket: any) {
        logger.debug('gallium connected')
        socket.join('gallium');

        socket.emit('frame', Object.assign({}, this.frame));

        socket.on('disconnect', () => {
            logger.debug('gallium disconnected');
        });
    }

    private queueUpdate(channel: number, value: number) {
        if (channel < 0 || channel >= 512) {
            logger.error("Trying to set channel out of range.");
            return;
        }

        // Clamp to avoid overflow errors
        const newValue = Math.min(Math.max(value, 0), 255);

        if (newValue !== this.frame[channel] ) {
            // If the value changed, add to updates queue
            this.frameQueue[channel] = newValue;
        } else if (this.frameQueue[channel] !== NO_UPDATE) {
            // If the update does not change the frame, but the queue has some previous update
            // reset the queue
            this.frameQueue[channel] = NO_UPDATE;
        }
    }

    private commitUpdates() {
        const diff: { [key: number]: number; } = {};

        // For each update, set frame to the new value and reset update
        this.frameQueue.map((update, channel) => {
            if (update !== NO_UPDATE) {
                this.frame[channel] = diff[channel] = update;
                return NO_UPDATE;
            };
        });

        return diff;
    }

    private emitKeyframe() {
        // Don't need to send it as an update if we're already sending the whole thing
        this.commitUpdates();

        // Commit the updates to the frame and send the frame
        this.gallium.emit('frame', Object.assign({}, this.frame));
    }

    private emitUpdates() {
        const payload = this.commitUpdates();

        const changes = Object.keys(payload).length;
        if (changes > 0) {
            logger.debug("Sending payload with " + changes + " updates");
            this.gallium.emit('frame', payload);
        }
    }
}