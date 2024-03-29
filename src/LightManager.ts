import logger from "./utils/Logger";
import { makeTextArray } from "./utils/PixelText";

import FrameUpdater from "./utils/FrameUpdater";
import ChannelPayload from "./utils/ChannelPayload";

import GameServer from "./GameServer";
import Layout from "./lights/Layout";
import Gallium from "./lights/interfaces/Gallium";

export const PIXEL_GRID_START = 141;
export const PIXEL_GRID_ROWS = 5;
export const PIXEL_GRID_COLUMNS = 12;

export interface IChannelInterface {
    displayPixels(pixels: number[][], offset: number): void;
    setChannel(internalChannel: number, value: number): void;
    set(updates: ChannelPayload): void;
    allOn(): void;
    allOff(): void;
}

export default class LightManager implements IChannelInterface {
    public static readonly FRAME_RATE = 50;
    public static readonly KEYFRAME_COUNT = 100;

    private frameUpdater: FrameUpdater;
    private gallium: Gallium;

    constructor(public layout: Layout, gs: GameServer) {
        this.frameUpdater = new FrameUpdater(512);

        this.gallium = new Gallium(gs);
        this.start();
    }

    public setChannel(internalChannel: number, value: number) {
        const channel = this.layout.lookupPatch(internalChannel);
        if (channel === undefined) {
            logger.error("No patch for " + internalChannel);
            return;
        }
        this.frameUpdater.setFinalChannel(channel, value);
    }

    public set(updates: ChannelPayload) {
        for (const channel of Object.keys(updates)) {
            // For makes channel a string, so the + converts it back to a number
            this.setChannel(+channel, updates[+channel]);
        }
    }

    public allOn() {
        logger.debug("Turning all lights on");

        // Updating internal frame for future updates
        this.frameUpdater.resetAndFill(255);
        this.gallium.sendAllOn();
    }

    public allOff() {
        logger.debug("Turning all lights off")

        // Updating internal frame for future updates
        this.frameUpdater.resetAndFill(0);
        this.gallium.sendAllOff();
    }

    public async displayPixelMessage(text: string, time: number) {
        logger.info("Writing " + text);
        // Pixels come in in row major order
        const pixels = makeTextArray(text);

        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // All the rows are the same, so the length of the first row is the
        // total horizontal length of the message
        const hiddenPixels = pixels[0].length;
        for (let scroll = -PIXEL_GRID_COLUMNS; scroll < hiddenPixels; scroll++) {
            this.displayPixels(pixels, scroll);
            await delay(time / hiddenPixels);
        }
    }

    public displayPixels(pixels: number[][], offset: number = 0) {
        for (let column = 0; column < PIXEL_GRID_COLUMNS; column++) {
            for (let row = 0; row < PIXEL_GRID_ROWS; row++) {
                const channel = PIXEL_GRID_START + 10*column + 2*row;
                const value = pixels[row][column + offset] || 0;

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
            if (count > LightManager.KEYFRAME_COUNT) {
                this.emitKeyframe();
                count = 0;
            } else {
                this.emitUpdates();
                count += 1;
            }
        }, LightManager.FRAME_RATE);
    }

    private emitKeyframe() {
        // Don't need to send it as an update if we're already sending the whole thing
        this.frameUpdater.commitUpdates();

        // Commit the updates to the frame and send the frame
        this.gallium.sendFrame(this.frameUpdater.getFrame(true));
    }

    private emitUpdates() {
        const payload = this.frameUpdater.commitUpdates();
        const changes = Object.keys(payload).length;
        if (changes > 0) {
            // logger.debug("Sending payload with " + changes + " updates");
            this.gallium.sendFrame(payload);
        }
    }
}