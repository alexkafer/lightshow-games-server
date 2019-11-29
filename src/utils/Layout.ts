import path from 'path';

import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileAsync";

import { Router, json } from 'express';
import cors from 'cors'

import Light from "./Light";

export default class Layout {
    public title: string;
    public resourcePath: string;

    private db: any;
    private router: Router;

    constructor(title: string, resourcePath: string) {
        this.title = title;
        this.resourcePath = resourcePath;

        this.initDatabase(title + '.json', resourcePath);

        this.router = Router();
        this.setupRouter();
    }

    private setupRouter() {
        this.router.use(json());
        this.router.use(cors());

        this.router.get('/map',  (req, res) => {
            res.sendFile(path.join(this.resourcePath, 'map.svg'));
        });

        this.router.get('/scene',  (req, res) => {
            res.sendFile(path.join(this.resourcePath, 'scene.obj'));
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