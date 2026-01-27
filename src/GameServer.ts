import express, { Express, RequestHandler } from 'express'
import { createServer, Server } from 'https';

import path from 'path';
import { readFileSync } from 'fs';
import logger from './utils/Logger';
import cors from 'cors';

export default class GameServer {
    private app: Express
    private server?: Server

    constructor() {
        this.app = express();

        this.app.use(cors({
           origin: "https://192.168.0.10"
        }));

        const key = readFileSync(process.env.SSL_KEY, 'utf8');
        const cert = readFileSync(process.env.SSL_CERT, 'utf8');
        const ca = readFileSync(process.env.SSL_CA, 'utf8');

        const credentials = { key, cert, ca };

        // initialize a simple  server
        this.server = createServer(credentials, this.app);
    }

    public getServer() {
        return this.server;
    }

    public getExpressApp() {
        return this.app;
    }

    public start(port: any) {
        if (this.server === undefined) {
            throw new Error("HTTP Server wasn't created correctly");
        }

        this.server.listen(port, () => {
            logger.info(`Game Server started on port ${port}.`);
        });
    }

    // Allow the API manager to hook into the server.
    public use(route: string, requestHandler: RequestHandler) {
        return this.app.use(route, requestHandler);
    }

    public useAdmin(buildPath: string) {
        this.app.use(express.static(buildPath))

        // Handles any requests that don't match the ones above
        this.app.get('*', (req, res) =>{
            res.sendFile(path.join(buildPath, 'index.html'));
        });
    }
}