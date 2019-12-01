import Game from '../utils/Game'
import User from "../utils/User"
import LightShow from '../LightShow';

import logger from '../utils/Logger';

export default class Manual extends Game {

    constructor(lightShow: LightShow) {
        super(lightShow, "Manual", ['allOn', 'allOff', 'add'], 1);
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

    action(user: User, message: string, payload: any): void {
        if (message === "allOn") {
            this.lightShow.allOn();
        }

        if (message === "allOff") {
            this.lightShow.allOff();
        }

        if (message === "add") {
            this.lightShow.addToChannel(payload, payload);
        }
    }
}