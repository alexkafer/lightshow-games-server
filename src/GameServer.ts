import express, { Express, RequestHandler } from 'express'
import { createServer, Server } from 'https';

import path from 'path';
import { readFileSync } from 'fs';
import logger from './utils/Logger';

export default class GameServer {
    private app: Express
    private httpServer?: Server

    constructor(configPath: string) {
        this.app = express();

        const config = JSON.parse(readFileSync(configPath).toString());

        const privateKey = readFileSync(config.certificate.key, 'utf8');
        const certificate = readFileSync(config.certificate.cert, 'utf8');
        const ca = readFileSync(config.certificate.ca, 'utf8');

        const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca
        };

        // initialize a simple  server
        this.httpServer = createServer(credentials, this.app);
    }

    public getHTTPServer() {
        return this.httpServer;
    }

    public getExpressApp() {
        return this.app;
    }

    public start(port: any) {
        if (this.httpServer === undefined) {
            throw new Error("HTTP Server wasn't created correctly");
        }

        this.httpServer.listen(port, () => {
            logger.info(`Game Server started on port ${port}`);
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