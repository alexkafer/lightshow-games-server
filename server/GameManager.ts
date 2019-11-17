import Game from './games/Game'
import User from './utils/User';

import { Queue } from 'queue-typescript';
import GameServer from './GameServer';
import AdminPortal from './admin/Admin';
import UserManager from './UserManager';
import LightShow from './LightShow';

export default class GameManager {

    private static GAMES: Map<string, Game> = new Map<string, Game>();;
    public static registerGame(game: Game, identifer: string) {
        console.debug("Registered " + identifer);
        GameManager.GAMES.set(identifer, game);
    }

    public static listGames(): string[] {
        return Array.from(GameManager.GAMES.keys());
    }

    private currentGame: Game;
    private playerQueue: Queue<User>;

    private gameServer: GameServer

    constructor(um: UserManager, private ls: LightShow) {
        this.playerQueue = new Queue<User>();

        um.on('userJoined', this.onNewUser.bind(this));
        um.on('userLeft', this.onUserLeft.bind(this));
    }

    public getServer(): GameServer {
        return this.gameServer;
    }

    public getCurrentGame(): string {
        return this.currentGame.title;
    }

    public startGame(newGame: string) {
        if (GameManager.GAMES.has(newGame)) {
            // Turn off previous game, if it exists
            if (this.currentGame) {
                this.currentGame.shutdown();
            }

            // Update the current game, and set it up
            this.currentGame = GameManager.GAMES.get(newGame);
            this.currentGame.initialize(this.ls);
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
                    this.currentGame.action(user, action, payload);
                });
            });
        } else {
            // Game doesn't have space. Add them to the queue.
            this.playerQueue.enqueue(user);
        }
    }

    public onUserLeft(user: User): void {
        if (this.playerQueue.remove(user) === undefined) {
            this.currentGame.disconnected(user);
        }
    }
}