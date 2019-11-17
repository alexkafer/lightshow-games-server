import Game from './Game'
import RayTracer from '../utils/RayTracer'
import User from '../utils/User'

export default class Wand extends Game {
    // private raytracer: RayTracer;

    constructor() {
        super("Wand", ["odometry"]);
    }

    loop() {
        console.log("Loop");
    };

    shutdown() {
        console.log("Shutdown");
    }

    action(player: User, message: string, payload: any) {
        if (message === "odometry") {
            if (payload.alpha > 180) {
                this.gameManager.show.allOn();
            } else {
                this.gameManager.show.allOff();
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