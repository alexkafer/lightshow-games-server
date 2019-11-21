import Game from './utils/Game'
import User from './utils/User';

import PlayerQueue from './utils/PlayerQueue';
import UserManager from './UserManager';

export default class GameManager {

    private static GAMES: Map<string, Game> = new Map<string, Game>();;
    public static registerGame(game: Game, identifer: string) {
        console.debug("Registered " + identifer);
        GameManager.GAMES.set(identifer, game);
    }

    public static listGames(): string[] {
        return Array.from(GameManager.GAMES.keys());
    }

    private currentGame: Game | undefined;
    private playerQueue: PlayerQueue;

    constructor(um: UserManager) {
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
                this.currentGame.setup();
            }

        } else {
            console.error(newGame + " is not a registered game. Please fix or register the game.")
        }
    }

    // Triggers a new user navigates to the website
    public onNewUser(user: User): void {
        user.currentSocket.emit("game", this.currentGame.title);

        user.currentSocket.on("start", this.startGameForUser(user).bind(this))
        user.currentSocket.on("end", this.endGameForUser(user).bind(this))

        this.playerQueue.push(user);
    }

    public startGameForUser(user: User) {
        return () => {
            if (this.currentGame && this.playerQueue.isNext(user) && this.currentGame.addPlayer(user)) {
                // Attach listeners for the game
                this.currentGame.listenFor.forEach((action) => {
                    user.currentSocket.on(action, (payload: any) => {
                        if (this.currentGame) {
                            this.currentGame.action(user, action, payload);
                        }
                    });
                });
            }
        }
    }

    public endGameForUser(user: User) {
        return () => {
            if (this.currentGame) {
                this.currentGame.disconnected(user)
            }

            this.playerQueue.push(user);
        }
    }

    public onUserLeft(user: User): void {
        if (this.currentGame) {
            this.currentGame.disconnected(user);
        }

        this.playerQueue.remove(user);
    }
}