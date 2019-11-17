import Game from './games/Game'
import LightShow from "./scene/LightShow";
import { IUserDelegate } from './UserManager';
import User from './utils/User';

import { Queue } from 'queue-typescript';

export default class GameManager implements IUserDelegate  {

    private games: Map<string, Game>;
    public registerGame(game: Game, identifer: string) {
        this.games.set(identifer, game);

    }

    public show: LightShow;
    private currentGame: Game;
    private playerQueue: Queue<User>;

    constructor(show: LightShow) {
        this.show = show;
        this.playerQueue = new Queue<User>();

        this.games = new Map<string, Game>();
    }

    public startGame(newGame: string) {
        if (this.games.has(newGame)) {
            // Turn off previous game, if it exists
            if (this.currentGame) {
                this.currentGame.shutdown();
            }

            // Update the current game, and set it up
            this.currentGame = this.games.get(newGame);
            this.currentGame.initialize(this);
        } else {
            console.error(newGame + " is not a registered game. Please fix or register the game.")
        }
    }

    // Triggers a new user navigates to the website
    onNewUser(user: User): void {
        // Try adding the player
        if (this.currentGame && this.currentGame.addPlayer(user)) {

            // Attach listeners for the game
            this.currentGame.listenFor.forEach((action) => {
                user.currentSocket.on(action, (payload: any) => {
                    this.currentGame.action(user, action, payload);
                });
            });
        } else {
            // Game doesn't have space. Add them to the queue.
            this.playerQueue.enqueue(user);
        }
    }

    onUserLeft(user: User): void {
        if (this.playerQueue.remove(user) === undefined) {
            this.currentGame.disconnected(user);
        }
    }
}