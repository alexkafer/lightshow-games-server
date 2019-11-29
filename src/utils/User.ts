import { Socket } from "socket.io";
import { Vector3, Euler } from "three";

export default class User {
    currentSocket: Socket;
    position: Vector3 | undefined;
    direction: Vector3 | undefined;

    constructor(socket: Socket) {
        this.currentSocket = socket;
    }

    public setPosition(x: number, y: number) {
        this.position = new Vector3(x, 0, y);
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    public setDirection(alpha: number, beta: number, gamma: number) {
        // var degreesDiff = new Euler(alpha, beta, gamma);
        // var b = new Vector3( 1, 0, 1 );
        this.direction = new Vector3(beta, alpha, gamma);
    }

    public getDirection(): Vector3 {
        return this.direction;
    }
}