import { Express, Router } from 'express';
import GameManager from '../GameManager';

export default class AdminPortal {
    private gameManager: GameManager;
    private router: Router;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.router = Router();
        this.setupRouter();
    }

    private setupRouter() {
        this.router.get('/game',  (req, res) => {
            res.json({
                "success": true,
                "current": this.gameManager.getCurrentGame(),
                "registered": GameManager.listGames()
            });
        })

        this.router.post('/game',  (req, res) => {
            const newGame = req.body.game;
            this.gameManager.startGame(newGame);
            res.sendStatus(200);
        })
    }

    public initRoutes(app: Express) {
        app.use('/admin', this.router);
    }
}