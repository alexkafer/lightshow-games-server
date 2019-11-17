import express from 'express';
import { Express, NextFunction, Request, Response } from 'express'
import { createServer, Server } from 'https';
import { readFileSync } from 'fs';
import SocketIO, { Socket } from "socket.io";

import UserManager from './UserManager';
import LightShow from './scene/LightShow';

export default class GameServer {
    private app?: Express
    private httpServer?: Server
    private gallium: SocketIO.Server;
    private io: SocketIO.Server;

    constructor(private userManager: UserManager, private lightShow: LightShow) {
       this.app = express();

        // initialize a simple  server
        this.httpServer = createServer({
            key: readFileSync('server.key'),
            cert: readFileSync('server.cert'),
            rejectUnauthorized: false
        }, this.app);

        this.gallium = SocketIO(this.httpServer, {
            path: '/gallium'
        });

        lightShow.connect(this.gallium);

        this.io = SocketIO(this.httpServer);

        this.app.use(express.static('static'));

        // middleware
        this.gallium.use((socket, next) => {
            const token = socket.handshake.query.token;
            if (token === "lightshow2") {
                return next();
            }
            return next(new Error('authentication error'));
        });

        this.configureApiEndpoints(this.app);

        this.io.on('connection', this.userConnection.bind(this));
    }

    public start(port: number) {
        this.httpServer.listen(port, () => {
            console.log(`Game Server started on port ${port}`);
        });
    }

    private userConnection(socket: any) {
        console.log('a user connected');
        socket.join('users');

        this.userManager.addUser(socket);

        socket.on('disconnect', () => {
            console.log('user disconnected');
            this.userManager.disconnectUser(socket);
        });
    }

    private configureApiEndpoints(server: Express) {
        // server.get('/scene', this.getCurrentScene)
    }
}