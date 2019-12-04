import logger from "./utils/Logger";
import { makeTextArray } from "./utils/PixelText";

import {FrameUpdater, ChannelPayload} from "./utils/FrameUpdater";

import GameServer from "./GameServer";
import Layout from "./utils/Layout";

import SocketIO from "socket.io";

const NETLIGHT_START = 141;
const NETLIGHT_ROWS = 5;
const NETLIGHT_COLUMNS = 12;


export default class LightShow {
    public static readonly FRAME_RATE = 50;
    public static readonly KEYFRAME_COUNT = 100;

    private gallium: SocketIO.Server;
    private frameUpdater: FrameUpdater;

    constructor(public layout: Layout, gs: GameServer) {
        this.frameUpdater = new FrameUpdater(512);

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

        this.start();
    }

    public setChannel(internalChannel: number, value: number) {
        this.frameUpdater.setChannel(internalChannel, value);
    }

    public set(updates: ChannelPayload) {
        this.frameUpdater.set(updates);
    }

    public allOn() {
        logger.debug("Turning all lights on");

        // Updating internal frame for future updates
        this.frameUpdater.resetAndFill(255);
        this.gallium.emit('allOn');
    }

    public allOff() {
        logger.debug("Turning all lights off")

        // Updating internal frame for future updates
        this.frameUpdater.resetAndFill(0);
        this.gallium.emit('allOff');
    }

    public async displayPixelMessage(text: string, time: number, reverse: boolean) {
        logger.info("Writing " + text);
        // Pixels come in in row major order
        const pixels = makeTextArray(text);


        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // All the rows are the same, so the length of the first row is the
        // total horizontal length of the message
        const hiddenPixels = pixels[0].length - NETLIGHT_COLUMNS;
        for (let scroll = 0; scroll < hiddenPixels; scroll++) {
            this.displayPixels(pixels, scroll);
            await delay(time / hiddenPixels);
        }

        if (!reverse) return;

        for (let scroll = hiddenPixels-1; scroll >= 0; scroll++) {
            this.displayPixels(pixels, scroll);
            await delay(time / hiddenPixels);
        }
    }

    private displayPixels(pixels: boolean[][], offset: number = 0) {
        for (let column = 0; column < NETLIGHT_COLUMNS; column++) {
            for (let row = 0; row < NETLIGHT_ROWS; row++) {
                const channel = NETLIGHT_START + 10*column + 2*row;
                const value = pixels[row][column + offset] ? 255 : 0;

                this.setChannel(channel, value);
                this.setChannel(channel+1, value);
            }
        }
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

        socket.emit('frame', Object.assign({}, this.frameUpdater.getFrame(false)));

        socket.on('disconnect', () => {
            logger.debug('gallium disconnected');
        });
    }

    private emitKeyframe() {
        // Don't need to send it as an update if we're already sending the whole thing
        this.frameUpdater.commitUpdates();

        // Commit the updates to the frame and send the frame
        this.gallium.emit('frame', this.frameUpdater.getFrame(true));
    }

    private emitUpdates() {
        const payload = this.frameUpdater.commitUpdates();
        const changes = Object.keys(payload).length;
        if (changes > 0) {
            logger.debug("Sending payload with " + changes + " updates");
            this.gallium.emit('frame', payload);
        }
    }
}