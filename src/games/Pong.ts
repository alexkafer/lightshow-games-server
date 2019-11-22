import Game from '../utils/Game'
import User from "../utils/User"
import LightShow from '../LightShow';

import logger from '../utils/Logger';

export default class Pong extends Game {

    constructor(lightShow: LightShow) {
        super(lightShow, "Pong", ['ping']);
    }

    setup(): void {
        logger.info("Starting pong");
    }

    loop(): void {
        logger.info("Loop pong");
    }
    shutdown(): void {
        logger.info("Shutting down pong");
    }

    action(user: User, message: string, payload: any): void {
        logger.info("Pong action!", message, payload);
    }
}