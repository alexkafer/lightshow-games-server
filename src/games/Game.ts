import GameManager from '../GameManager'
import User from '../utils/User'

import { LinkedList } from 'linked-list-typescript';

export default abstract class Game {
    public title: string;
    public listenFor: string[];


    protected gameManager: GameManager
    protected players: LinkedList<User>;

    private maxPlayers: number;

    abstract loop() : void;
    abstract shutdown() : void;
    abstract action(user: User, message: string, payload: any) : void;

    constructor(title: string, listenFor: string[], maxPlayers: number = Infinity) {
        this.title = title;
        this.listenFor = listenFor;

        this.players = new LinkedList<User>();
    }

    public initialize(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

    public addPlayer(user: User): boolean {
        if (this.players.length < this.maxPlayers) {
            this.players.append(user);
            return true;
        }

        return false;
    }

    public disconnected(user: User) {
        this.players.remove(user);
    };
}