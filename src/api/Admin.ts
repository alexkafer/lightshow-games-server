import { Router, json } from 'express';
import SocketIO from "socket.io";

import cors from 'cors'

import GameManager from '../GameManager';
import GameServer from '../GameServer';

export default class Admin {
    private gameManager: GameManager;
    private router: Router;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.router = Router();
        this.setupRouter();
    }

    private setupRouter() {
        this.router.use(json());
        this.router.use(cors());

        this.router.get('/',  (req, res) => {
            res.json({
                "success": true,
                "current": this.gameManager.getCurrentGame(),
                "registered": GameManager.listGames()
            });
        });


        this.router.get('/queue',  (req, res) => {
            res.json({
                "success": true,
                "queue": this.gameManager.listQueue()
            });
        });

        this.router.post('/',  (req, res) => {
            const newGame = req.body.game;
            this.gameManager.startGame(newGame);
            res.sendStatus(200);
        });
    }

    public getRouter() {
        return this.router;
    }
}