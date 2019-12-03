import logger from '../utils/Logger';

import { Socket } from "socket.io";
import { Vector3 } from "three";

import { IQueueable } from '../utils/SlottedQueue';

export default class Player implements IQueueable {
    currentSocket: Socket;

    private position: Vector3 | undefined;
    private direction: Vector3 | undefined;

    constructor(socket: Socket) {
        this.currentSocket = socket;
        this.position = new Vector3();
    }

    public setPosition(position: Vector3) {
        this.position.copy(position);
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

        this.direction = new Vector3(x, y, z).normalize();
    }

    public getDirection(): Vector3 {
        return this.direction;
    }

    notifyPosition(position: number): void {
        if (this.currentSocket.connected) {
            logger.http('Telling ' + this.currentSocket.id + " that they are now " + position + " in line");
            this.currentSocket.emit("queue", position);
          }
    }
}