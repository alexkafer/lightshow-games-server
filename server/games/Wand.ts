import Game from './Game'
import User from '../utils/User'
import LightShow from '../LightShow';

export default class Wand extends Game {
    constructor(lightShow: LightShow) {
        super(lightShow, "Wand", ["odometry"]);
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

    action(player: User, message: string, payload: any) {
        if (message === "odometry") {
            if (payload.alpha > 180) {
                this.lightShow.allOn();
            } else {
                this.lightShow.allOff();
            }
        }
    }
}