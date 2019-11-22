import Game from '../utils/Game'
import User from '../utils/User'
import LightShow from '../LightShow';

import {Vector2, Vector3} from 'three';
import { logger } from '../utils/Logger';

export default class Wand extends Game {

    private locations: Map<string, Vector2>
    private orientations: Map<string, Vector3>

    constructor(lightShow: LightShow) {
        super(lightShow, "Wand", ["odometry"], 1);
    }

    setup() {
        console.log("Starting Wand");
    }

    loop() {
        console.log("Loop wand");
    };

    shutdown() {
        console.log("Shutdown wand");
    }

    action(user: User, message: string, payload: any) {
        logger.debug("Wand received action: ", message, payload);

        if (message === "position") {
            if (payload.x && payload.y) {
                logger.verbose("Setting player position", payload);
                this.locations.set(user.currentSocket.id, new Vector2(payload.x, payload.y));
            } else {
                logger.warn("Received bad position payload", payload);
            }
        }

        if (message === "orientation") {
            if (payload.alpha && payload.beta && payload.gamma) {
                logger.verbose("Setting player orientation", payload);
                this.orientations.set(user.currentSocket.id, new Vector3(payload.alpha, payload.beta, payload.gamma));
            } else {
                logger.warn("Received bad orientation payload", payload);
            }
        }
    }
}