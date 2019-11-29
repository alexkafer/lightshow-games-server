import { Socket } from "socket.io";
import { Vector3, Euler } from "three";

export default class User {
    currentSocket: Socket;

    private position: Vector3 | undefined;
    private direction: Vector3 | undefined;

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
        const pi = Math.PI;
        const yaw = alpha * (pi/180);
        const pitch = beta * (pi/180);

        const x = Math.sin(yaw)*Math.cos(pitch);
        const z = Math.cos(yaw)*Math.cos(pitch);
        const y = Math.sin(pitch);

        this.direction = new Vector3(x, y, z);
    }

    public getDirection(): Vector3 {
        return this.direction;
    }
}