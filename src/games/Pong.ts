import Game from './Game'
import User from "../utils/User"

export default class Pong extends Game {


    constructor() {
        super("Pong", ['ping']);
    }

    loop(): void {
        throw new Error("Method not implemented.");
    }
    shutdown(): void {
        throw new Error("Method not implemented.");
    }

    action(user: User, message: string, payload: any): void {
        throw new Error("Method not implemented.");
    }
}