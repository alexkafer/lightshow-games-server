import logger from "./Logger";

const NO_UPDATE: number = -1;

export interface ChannelPayload {
    [channel: number]: number;
}

export class FrameUpdater  {
    private frameQueue: number[];
    private frame: number[];

    constructor(private size: number) {
        this.frameQueue = new Array<number>(size);
        this.frameQueue.fill(NO_UPDATE);

        // The frame is what we currently expect the light show to be displaying
        this.frame = new Array<number>(size);
        this.frame.fill(0);
    }

    public setFinalChannel(channel: number, value: number) {
        if (channel === undefined || value === undefined) {
            logger.error("Setting undefined channel or value: " + channel + " " + value);
            return
        }

        if (channel < 1 || channel > this.size) {
            logger.error("Trying to set channel out of range: " + channel);
            return;
        }

        // Clamp to avoid overflow errors
        this.updateChannel(channel, Math.min(Math.max(value, 0), 255));
    }

    // Translates channel to zero index.
    private updateChannel(channel: number, value: number) {
        const zeroedChannel = channel - 1;
        if (value !== this.frame[zeroedChannel] ) {
            // If the value changed, add to updates queue
            this.frameQueue[zeroedChannel] = value;
        } else if (this.frameQueue[zeroedChannel] !== NO_UPDATE) {
            // If the update does not change the frame, but the queue has some previous update
            // clear the existing update
            this.frameQueue[zeroedChannel] = NO_UPDATE;
        }
    }

    public resetAndFill(value: number) {
        this.frameQueue.fill(NO_UPDATE);
        this.frame.fill(value);
    }

    public commitUpdates(): ChannelPayload {
        const diff: ChannelPayload = {};

        for (let channel = 0; channel < this.frameQueue.length; channel++) {
            if (this.frameQueue[channel] !== NO_UPDATE) {

                this.frame[channel] = diff[channel+1] = this.frameQueue[channel];
                this.frameQueue[channel] = NO_UPDATE;
            };
        }

        return diff;
    }

    public getFrame(commitUpdates: boolean): ChannelPayload   {
        const framePayload: ChannelPayload = {};

        for (let channel = 0; channel < this.frame.length; channel++) {
            if (commitUpdates && this.frameQueue[channel] !== NO_UPDATE) {
                this.frame[channel] = framePayload[channel+1] = this.frameQueue[channel];
                this.frameQueue[channel] = NO_UPDATE;
            } else {
                framePayload[channel+1] = this.frame[channel];
            }
        }

        return framePayload;
    }}