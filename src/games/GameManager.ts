import logger from '../utils/Logger';

import Game from './Game'
import Player from './Player';
import PlayerManager from '../PlayerManager';

export default class GameManager {

    private static GAMES: Map<string, Game> = new Map<string, Game>();;
    public static registerGame(game: Game, identifer: string) {
        logger.debug("Registered " + identifer);
        GameManager.GAMES.set(identifer, game);
    }

    public static listGames(): string[] {
        return Array.from(GameManager.GAMES.keys());
    }

    private currentGame: Game | undefined;
    private playerManager: PlayerManager;

    constructor(um: PlayerManager) {
        this.playerManager = um;

        um.on('visitorJoined', this.onNewVisitor.bind(this));
        um.on('playerStarted', this.startPlayer.bind(this));
    }

    public getCurrentGame(): string {
        if (this.currentGame) {
            return this.currentGame.title;
        }
        return 'None';
    }

    public startGame(newGame: string) {
        if (GameManager.GAMES.has(newGame)) {
            // Turn off previous game, if it exists
            if (this.currentGame) {
                this.currentGame.shutdown();
                this.playerManager.kickPlayers();
            }

            // Update the current game, and set it up
            this.currentGame = GameManager.GAMES.get(newGame);

            if (this.currentGame) {
                this.currentGame.initialize(this.playerManager);
                this.playerManager.createSlots(this.currentGame.playerMax);
            }

            this.playerManager.notifyGameUpdate(this.currentGame.title);
        } else {
            logger.error(newGame + " is not a registered game. Please fix or register the game.")
        }

        // Loop game 5 times a second
        setInterval(this.currentGame.loop.bind(this.currentGame), 50);

        // Update the admin interface every second
        setInterval(this.playerManager.updateAdmin.bind(this.playerManager), 50);
    }

    public startPlayer(newPlayer: Player) {
        // Attach listeners for the game
        this.currentGame.listenFor.forEach((action) => {
            newPlayer.currentSocket.on(action, (payload: any) => {
                if (this.validateAction(action, newPlayer.currentSocket.id)) {
                    this.currentGame.action(newPlayer, action, payload);
                }
            });
        });
    }

    private validateAction(action: string, player: string): boolean {
        return this.currentGame && this.currentGame.listenFor.indexOf(action) >= 0 && this.playerManager.isPlayer(player);
    }

    // Triggers a new user navigates to the website
    public onNewVisitor(visitor: Player): void {
        visitor.currentSocket.emit("game", this.getCurrentGame());
    }
}