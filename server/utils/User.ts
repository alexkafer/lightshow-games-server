import { Socket } from "socket.io";
import { Vector3 } from "three";

export default class User {
    currentSocket: Socket;

    constructor(socket: Socket) {
        this.currentSocket = socket;
    }
}