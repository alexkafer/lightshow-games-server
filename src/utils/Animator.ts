import logger from "./Logger";

import { ChannelPayload } from "./FrameUpdater";
import { makeTextArray } from './PixelText';

import LinearTransition from "./Animations/LinearTransition";
import SequenceAnimation from "./Animations/Sequence";

export interface IAnimation {
    isFinished(): boolean;
    getNextValue() : number;
}

export default class Animator  {
    private animations: Map<number, IAnimation>;

    constructor() {
        this.animations = new Map<number, IAnimation>();
    }

    public startLinearTransition(channels: number[], from: number, to: number, step: number) {
        channels.forEach((channel) => {
            this.animations.set(channel, new LinearTransition(from, to, step));
        })
    }

    public animate(): ChannelPayload{
        const updates: ChannelPayload = {};

        this.animations.forEach((animation, channel, map) => {
            const value = animation.getNextValue();
            if (value >= 0 && value < 256) {
                updates[channel] = value;
            } else {
                map.delete(channel);
            }
        })

        const changes = Object.keys(updates).length;
        if (changes > 0) {
            logger.info("Animated " + changes + " channels.");
        }

        return updates;
    }
}