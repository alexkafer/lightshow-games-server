import { Router, json } from 'express';
import cors from 'cors'

import GameManager from './GameManager';

// TODO, merge this with the socket admin api
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