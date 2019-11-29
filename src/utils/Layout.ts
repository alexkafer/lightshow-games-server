import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileAsync";

import { Router, json } from 'express';
import cors from 'cors'

import Light from "./Light";

export default class Layout {
    public title: string;
    public mapPath: string;

    private db: any;
    private router: Router;

    constructor(title: string, mapPath: string) {
        this.title = title;
        this.mapPath = mapPath;

        this.initDatabase(title + '.json', mapPath);

        this.router = Router();
        this.setupRouter();
    }

    private setupRouter() {
        this.router.use(json());
        this.router.use(cors());

        this.router.get('/',  (req, res) => {
            res.sendFile(this.mapPath);
        });
    }

    public getRouter() {
        return this.router;
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