import Game from '../utils/Game'
import User from '../utils/User'
import LightShow from '../LightShow';

import logger from '../utils/Logger';

export default class Manual extends Game {
    constructor(lightShow: LightShow) {
        super(lightShow, "Manual", ["orientation", "motion"]);
    }

    setup() {
        logger.info("Starting Manual");
    }

    loop() {
        logger.info("Loop Manual");
    };

    shutdown() {
        logger.info("Shutdown Manual");
    }

    action(player: User, message: string, payload: any) {
        logger.info(message, payload);
        if (message === "orientation") {
            if (payload.alpha > 180) {
                this.lightShow.allOn();
            } else {
                this.lightShow.allOff();
            }
        }
    }
}