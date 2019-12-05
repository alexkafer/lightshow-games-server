import Game from '../Game'
import Player from "../Player"
import LightShow from '../../LightManager';

import logger from '../../utils/Logger';

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
            this.lightShow.displayPixelMessage(payload, 2000)
        }
    }
}