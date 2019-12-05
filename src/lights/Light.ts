import { Vector3 } from "three";

export default class Light {
    public id: string;
    public position: Vector3;
    public channel: number;

    constructor(id: string, x: number, y: number, z: number, channel: number) {
        this.id = id;
        this.position = new Vector3(x, y, z);
        this.channel = channel;
    }
}