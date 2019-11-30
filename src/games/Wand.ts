import Game from '../utils/Game'
import User from '../utils/User'
import LightShow from '../LightShow';

import {Vector2, Vector3} from 'three';
import logger from '../utils/Logger';

import { Raycaster } from "three";

export default class Wand extends Game {

    private rayCaster: Raycaster;

    constructor(lightShow: LightShow) {
        super(lightShow, "Wand", ["position", "odometry"], 2);
        this.rayCaster = new Raycaster();
    }

    setup() {
        logger.info("Starting Wand");
    }

    loop() {
        const players = this.userManager.getPlayers();
        if (players) {
            players.forEach((user: User) => {
                const light = this.findLight(user.getPosition(), user.getDirection());

                if (light) {
                    this.lightShow.addToChannel(5, 255);
                }
            })
        }
    };

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

    private findLight(origin: Vector3, direction: Vector3) {
        if (origin && direction) {
            this.rayCaster.set(origin, direction);
            return this.rayCaster.intersectObject(this.lightShow.get3DLights());
        }

        return undefined;
    }
}