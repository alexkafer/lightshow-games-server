import path from 'path';
import uuid from 'uuid';
import {readFile} from 'fs';

import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileAsync";

import { Router, json } from 'express';
import cors from 'cors'

import Light from "./Light";
import logger from './Logger';
import { Vector3 } from 'three';

export default class Layout {
    private db: any;
    private router: Router;
    private map: string;
    private scene: string;
    private size: Vector3;
    private center: Vector3;

    constructor(private resourcePath: string, config: string = "config.json") {
        this.router = Router();

        readFile(path.join(resourcePath, config), this.handleJSONReference.bind(this));
    }

    private handleJSONReference(err: NodeJS.ErrnoException, data: Buffer) {
        if (err) {
            throw err;
        }
        const reference = JSON.parse(data.toString());
        logger.info("Loading Layout");

        logger.info("map: " + reference.map);
        this.map = reference.map;

        logger.info("scene: " + reference.scene);
        this.scene = reference.scene;

        logger.info("size: " + reference.size.x + " " + reference.size.y + " " + reference.size.z);
        this.size = new Vector3(reference.size.x,reference.size.y,reference.size.z);

        logger.info("center: " + reference.center.x + " " + reference.center.y + " " + reference.center.z);
        this.center = new Vector3(reference.center.x,reference.center.y, reference.center.z);

        logger.info("database: " + reference.database);

        this.initDatabase(path.join(this.resourcePath, reference.database)).then(() => {
            this.setupRouter();
        });
    }

    private setupRouter() {
        this.router.use(json());
        this.router.use(cors());

        this.router.get('/map',  (req, res) => {
            res.sendFile(path.join(this.resourcePath, this.map));
        });

        this.router.get('/scene',  (req, res) => {
            res.sendFile(path.join(this.resourcePath, this.scene));
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

        this.router.post('/lights/:id',  (req, res) => {
            res.json(this.db.get('lights').find({id: req.params.id}).assign({channel: req.body.channel}).value());
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
        if (this.db) {
            return this.db.get('lights').value()
        } else {
            return [];
        }
    }

    // Coords are x, y positions on a 2D map, with:
    // 0,0 being the center of the image
    // positive y being north, positive x being east
    public getScenePosition(x: number, y: number): Vector3 {
        const height = 0;
        // For the 2019 obj scene, y is the height, negative z is north.
        return new Vector3(x * this.size.x / 2, height, -y * this.size.z / 2).add(this.center);
    }
 }