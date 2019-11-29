import Game from './utils/Game'
import User from './utils/User';

import PlayerQueue from './utils/PlayerQueue';
import UserManager from './UserManager';

import logger from './utils/Logger';

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
    private playerQueue: PlayerQueue;
    private userManager: UserManager;

    constructor(um: UserManager) {
        this.userManager = um;
        this.playerQueue = new PlayerQueue();

        um.on('userJoined', this.onNewUser.bind(this));
        um.on('userLeft', this.onUserLeft.bind(this));
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
            }

            // Update the current game, and set it up
            this.currentGame = GameManager.GAMES.get(newGame);

            if (this.currentGame) {
                this.currentGame.initialize(this.userManager);
            }

            this.userManager.notifyGameUpdate(this.currentGame.title);
        } else {
            logger.error(newGame + " is not a registered game. Please fix or register the game.")
        }

        this.fillPlayers();

        // Loop game 5 times a second
        setInterval(this.currentGame.loop.bind(this.currentGame), 200);

        // Update the admin interface every second
        setInterval(this.userManager.updateAdmin.bind(this.userManager), 1000);
    }

    public canAddPlayer(): boolean {
        return this.userManager.numPlayers() < this.currentGame.playerMax;
    }

    private async fillPlayers() {
        if (this.currentGame && this.canAddPlayer()) {
            logger.info('Asking for player');
            const newPlayer = await this.playerQueue.getNextPlayer();
            this.userManager.addPlayer(newPlayer);
            logger.info('Player added');

            // Attach listeners for the game
            this.currentGame.listenFor.forEach((action) => {
                newPlayer.currentSocket.on(action, (payload: any) => {
                    if (this.currentGame) {
                        this.currentGame.action(newPlayer, action, payload);
                    }
                });
            });

            // Allow the user to manually end the game
            newPlayer.currentSocket.on("end", () => {
                if (this.currentGame) {
                    this.userManager.removePlayer(newPlayer);
                }
            });

            newPlayer.currentSocket.emit("started");

            this.fillPlayers();
        }
    }

    public listQueue(): string[]
    {
        return this.playerQueue.list();
    }

    // Triggers a new user navigates to the website
    public onNewUser(user: User): void {
        user.currentSocket.emit("game", this.currentGame.title);

        user.currentSocket.on("join", () => {
            this.playerQueue.push(user);
        });

        user.currentSocket.on("cancel", () => {
            this.playerQueue.removeFromQueue(user);
        });
    }

    public onUserLeft(user: User): void {
        if (!this.playerQueue.removeFromQueue(user)) {
            this.userManager.removePlayer(user);
            this.fillPlayers();
        }
    }
}