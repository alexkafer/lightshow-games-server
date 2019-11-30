
import logger from '../utils/Logger';

import {Vector3} from 'three';

import LightShow from '../LightShow';
import Game from '../utils/Game'
import User from '../utils/User'
import Light from '../utils/Light'

const THETA_THRESHOLD = Math.PI/16;

export default class Wand extends Game {


    constructor(lightShow: LightShow) {
        super(lightShow, "Wand", ["position", "odometry"], 2);
    }

    setup() {
        logger.info("Starting Wand");
    }

    loop() {

        // Game loops 5 times per second. This will fade away the entire show over 1 second.
        this.lightShow.uniformAdd(-51);

        // Check for light hits
        const lightVector = new Vector3();
        this.userManager.getPlayers().forEach((user: User) => {
            const playerPosition = user.getPosition();
            const playerVector = user.getDirection();

            if (playerPosition && playerVector) {
                this.lightShow.getLights().forEach((light: Light) => {
                    lightVector.subVectors( light.position, playerPosition ).normalize();

                    // Compute the dot product to find the angle between the player
                    // and the light. If it is in range, light it up.
                    if (Math.acos(playerVector.dot(lightVector)) < THETA_THRESHOLD) {
                        this.lightShow.addToChannel(light.channel, 255);
                    }
                })
            }
        });
    }

    shutdown() {
        logger.info("Shutdown wand");
    }

    action(user: User, message: string, payload: any) {
        if (message === "position") {
            if (payload.x && payload.y) {
                logger.verbose("Setting player position", payload);
                user.setPosition(payload.x, payload.y);
            } else {
                logger.warn("Received bad position payload", payload);
            }
        }

        if (message === "odometry") {
            if (payload.alpha && payload.beta && payload.gamma) {
                user.setDirection(payload.alpha, payload.beta, payload.gamma);
            } else {
                logger.warn("Received bad orientation payload", payload);
            }
        }
    }
}