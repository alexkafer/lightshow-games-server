import Game from './Game'
import User from '../utils/User'
import LightShow from '../LightShow';

export default class Manual extends Game {
    constructor(lightShow: LightShow) {
        super(lightShow, "Manual", ["orientation", "motion"]);
    }

    setup() {
        console.log("Starting Manual");
    }

    loop() {
        console.log("Loop Manual");
    };

    shutdown() {
        console.log("Shutdown Manual");
    }

    action(player: User, message: string, payload: any) {
        console.log(message, payload);
        if (message === "orientation") {
            if (payload.alpha > 180) {
                this.lightShow.allOn();
            } else {
                this.lightShow.allOff();
            }
        }
    }
}