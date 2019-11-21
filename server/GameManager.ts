import Game from './utils/Game'
import User from './utils/User';

import { Queue } from './utils/Queue';
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
    private playerQueue: Queue<User>;

    constructor(um: UserManager) {
        this.playerQueue = new Queue<User>();

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
        // Try adding the player
        if (this.currentGame && this.currentGame.addPlayer(user)) {

            // Attach listeners for the game
            this.currentGame.listenFor.forEach((action) => {
                user.currentSocket.on(action, (payload: any) => {
                    if (this.currentGame) {
                        this.currentGame.action(user, action, payload);
                    }
                });
            });
        } else {
            // Game doesn't have space. Add them to the queue.
            this.playerQueue.push(user);
        }
    }

    public onUserLeft(user: User): void {
        if (this.currentGame) {
            this.currentGame.disconnected(user);

            const nextPlayer = this.playerQueue.pop();
            if (nextPlayer && nextPlayer.currentSocket && nextPlayer.currentSocket.connected) {
                this.onNewUser(nextPlayer);
            }
        }
    }
}