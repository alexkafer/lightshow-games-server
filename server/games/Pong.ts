import Game from './Game'
import User from "../utils/User"
import LightShow from '../LightShow';

export default class Pong extends Game {

    constructor(lightShow: LightShow) {
        super(lightShow, "Pong", ['ping']);
    }

    setup(): void {
        console.log("Starting pong");
    }

    loop(): void {
        console.log("Loop pong");
    }
    shutdown(): void {
        console.log("Shutting down pong");
    }

    action(user: User, message: string, payload: any): void {
        console.log("Pong action!", message, payload);
    }
}