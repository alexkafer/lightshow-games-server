import Game from '../Game'
import Player from "../Player"
import LightShow from '../../LightShow';

import logger from '../../utils/Logger';
import {makeTextArray} from '../../utils/PixelText';

export default class Manual extends Game {

    constructor(lightShow: LightShow) {
        super(lightShow, "Manual", ['allOn', 'allOff', 'text', 'set'], 1);
    }

    setup(): void {
        logger.info("Starting manual");
    }

    loop(): void {
        // logger.info("Loop manual");
    }
    shutdown(): void {
        logger.info("Shutting down manual");
    }

    action(user: Player, message: string, payload: any): void {
        if (message === "allOn") {
            this.lightShow.allOn();
        }

        if (message === "allOff") {
            this.lightShow.allOff();
        }

        if (message === "set") {
            logger.info("Manually setting channel " + payload.channel + " to " + payload.value)
            this.lightShow.setChannel(payload.channel, payload.value);
        }

        if (message === "text") {
            logger.info("Setting message to " + payload)
            this.setMessage(payload);
        }
    }

    private setMessage(message: string) {
        const start = 141;

        // Pixels come in in row major order
        const pixels = makeTextArray(message);

        logger.info("Generated pixels")

        // top row
        for (let column = 0; column < 12; column++) {
            for (let row = 0; row < 5; row++) {
                const channel = start + 10*column + 2*row;
                const value = pixels[row][column] ? 255 : 0;
                // channel for red, channel + 1 for green
                this.lightShow.setChannel(channel, value);
                this.lightShow.setChannel(channel + 1, value);
            }
        }

        logger.info("Finished setting message")
    }
}