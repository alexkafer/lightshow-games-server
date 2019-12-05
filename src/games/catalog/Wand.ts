
import logger from '../../utils/Logger';

import {Vector3} from 'three';

import LightShow from '../../LightShow';
import Game from '../Game'
import Player from '../Player'
import Light from '../../utils/Light'
import Animator from '../../utils/Animator'

const THETA_THRESHOLD = Math.PI/8;

export default class Wand extends Game {

    private animator: Animator;
    private messageFinished: boolean;

    constructor(lightShow: LightShow) {
        super(lightShow, "Wand", ["position", "odometry"], 2);

        this.animator = new Animator();
        this.messageFinished = false;
    }

    setup() {
        logger.info("Starting Wand");
    }

    loop() {
        this.lightShow.set(this.animator.animate());

        // This will fade up the entire show over 1 second.
        // Check for light hits
        const lightVector = new Vector3();
        const lights = this.lightShow.layout.getLights();

        this.players.getPlayers().forEach((user: Player) => {
            const playerPosition = user.getPosition();
            const playerVector = user.getDirection();

            if (playerPosition && playerVector) {
                lights.forEach((light: Light) => {
                    lightVector.subVectors( light.position, playerPosition ).normalize();

                    // Compute the dot product to find the angle between the player
                    // and the light. If it is in range, light it up.
                    if (Math.acos(playerVector.dot(lightVector)) < THETA_THRESHOLD) {
                        // Turn the light on, and animate down to zero
                        this.lightShow.setChannel(light.channel, 255);
                        this.animator.startLinearTransition([light.channel], 255, 0, 10)
                    }
                })
            }
        });

        if (this.messageFinished) {
            this.messageFinished = false;
            this.lightShow.displayPixelMessage("WAND", 2000, true).then(() => {
                    this.messageFinished = true;
            });
        }
    }

    shutdown() {
        logger.info("Shutdown wand");
    }

    action(user: Player, message: string, payload: any) {
        if (message === "position") {
            if (payload.x !== undefined && payload.y !== undefined) {

                logger.verbose("Setting player position", payload);
                const pos = this.lightShow.layout.getScenePosition(payload.x, payload.y);
                logger.verbose("which translates to: " + pos.x + " " + pos.y + " " + pos.z);
                user.setPosition(pos);
            } else {
                logger.warn("Received bad position payload", payload);
            }
        }

        if (message === "odometry") {
            if (payload.alpha !== undefined && payload.beta !== undefined && payload.gamma !== undefined) {
                user.setDirection(payload.alpha, payload.beta, payload.gamma);
            } else {
                logger.warn("Received bad orientation payload", payload);
            }
        }
    }
}