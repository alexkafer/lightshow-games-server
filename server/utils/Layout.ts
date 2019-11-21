import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileAsync";

import Light from "./Light";

export default class Layout {
    public title: string;

    private db: any;

    constructor(title: string, mapSVG: string) {
        this.title = title;

        this.initDatabase(title + '.json', mapSVG);
    }

    private async initDatabase(file: string, mapSVG: string) {
        const adapter = new FileAsync(file);
        this.db = await lowdb(adapter);

        this.db.defaults({ lights: [], map: mapSVG}).write();
    }

    protected AddLight(light: Light) {
        return this.db.get('lights').push(light).write();
    }
}