import express, { Express } from 'express'
import { createServer, Server } from 'http';

import path from 'path';

export default class GameServer {
    private app: Express
    private httpServer?: Server

    constructor() {
       this.app = express();

        // initialize a simple  server
        this.httpServer = createServer(this.app);

        // this.app.use(express.json());
    }

    public getHTTPServer() {
        return this.httpServer;
    }

    public getExpressApp() {
        return this.app;
    }

    public serveClient() {
        this.app.use(express.static(path.join(__dirname, '..', 'client')));

        this.app.get('/',  (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
        });
    }

    public start(port: number) {
        if (this.httpServer === undefined) {
            throw new Error("HTTP Server wasn't created correctly");
        }

        this.httpServer.listen(port, () => {
            console.log(`Game Server started on port ${port}`);
        });
    }
}