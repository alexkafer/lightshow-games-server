import path from 'path';
import uuid from 'uuid';

import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileAsync";

import { Router, json } from 'express';
import cors from 'cors'

import Light from "./Light";
import logger from './Logger';

export default class Layout {
    public title: string;
    public resourcePath: string;

    private db: any;
    private router: Router;

    constructor(title: string, resourcePath: string) {
        this.title = title;
        this.resourcePath = resourcePath;

        this.initDatabase(path.join(resourcePath, title + '.json'));

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

        this.router.get('/lights',  (req, res) => {
            res.json(this.db.get('lights'))
        });

        this.router.post('/lights',  (req, res) => {
            const light = {
                x: req.body.x,
                y: req.body.y,
                z: req.body.z,
                channel: req.body.channel
            };

            this.createLight(light);

            res.json(this.db.get('lights'))
        });

        this.router.delete('/lights/:id',  (req, res) => {
            res.json(this.db.get('lights').remove({id: req.params.id}).value());
        });
    }

    public getRouter() {
        return this.router;
    }

    private async initDatabase(file: string) {
        const adapter = new FileAsync(file);
        this.db = await lowdb(adapter);

        this.db.defaults({ lights: []}).write();
    }

    private createLight(l: any) {
        if (l.x && l.y && l.z && l.channel) {
            const light = new Light(uuid(), l.x, l.y, l.z, l.channel)
            logger.info("Adding light.");
            this.db.get('lights').push(light).write();
        } else {
            logger.info("Invalid light. Not adding.");
        }
    }

    public getLights(): Light[] {
        return this.db.get('lights')
    }
}