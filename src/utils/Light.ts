import { Vector3 } from "three";

export default class Light {
    public position: Vector3;
    public channel: number;

    constructor(position: Vector3, channel: number) {
        this.position = position;
        this.channel = channel
    }
}