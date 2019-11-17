import { Socket } from "socket.io";
import { Vector3 } from "three";

export default class User {
    currentSocket: Socket;

    position: Vector3;
    direction: Vector3;
    mouseX: number;
    mouseY: number;

    constructor(socket: Socket) {
        this.currentSocket = socket;
    }

    public updateOdometry(position: Vector3, direction: Vector3) {
        this.position = position;
        this.direction = direction;
    }

    public updateMouse(mouse: any) {
        this.mouseX = mouse.x;
        this.mouseY = mouse.y;
    }
}