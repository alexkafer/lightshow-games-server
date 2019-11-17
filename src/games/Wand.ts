import Game from './Game'
import RayTracer from '../utils/RayTracer'
import User from '../utils/User'

export default class Wand extends Game {
    // private raytracer: RayTracer;

    constructor() {
        super("Wand", ["odometry"]);
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

    private castRay() {
        // const hit = this.raytracer.castRay(this.gameManager.show, user)
        // console.log(hit);
        // if (hit !== undefined) {
        //     user.currentSocket.emit('intersection', hit);
        // }
    }
}