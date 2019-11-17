import express, { Express } from 'express'
import { createServer, Server } from 'http';

export default class GameServer {
    private app: Express
    private httpServer?: Server

    constructor() {
       this.app = express();

        // initialize a simple  server
        this.httpServer = createServer(this.app);

        this.app.use(express.static('static'));
        this.app.use(express.json());
    }

    public getHTTPServer() {
        return this.httpServer;
    }

    public getExpressApp() {
        return this.app;
    }

    public start(port: number) {
        this.httpServer.listen(port, () => {
            console.log(`Game Server started on port ${port}`);
        });
    }
}