
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
        var lightVector = new Vector3();
        this.userManager.getPlayers().forEach((user: User) => {
            var playerPosition = user.getPosition();
            var playerVector = user.getDirection();

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

    private hitLights(user: User) {
        const origin = user.getPosition();
        const direction = user.getDirection();
        if (origin && direction) {
           
            var lightVector = new Vector3();
            var playerVector = new Vector3();
            for (var i = visitors.children.length - 1; i >= 0; i--) {
                for (var j = lights.children.length - 1; j >= 0; j--) {
                    lights.children[j].material.color.setHex(0xffffff);
                    lightVector.subVectors( lights.children[j].position, visitors.children[i].position ).normalize();
                    playerVector.copy( visitors.children[i].up ).applyQuaternion( visitors.children[i].quaternion).negate();
                    
                    if (Math.acos(playerVector.dot(lightVector)) < thetaThreshold) {
                        lights.children[j].material.color.setHex(0xffff00);
                    } 
                }
            }
        }
    }
}