import { LinkedList } from 'linked-list-typescript';

import User from '../utils/User'
import LightShow from '../LightShow';

export default abstract class Game {
    public title: string;
    public listenFor: string[];

    protected lightShow: LightShow;
    protected players: LinkedList<User>;

    private maxPlayers: number;

    abstract setup() : void;
    abstract loop() : void;
    abstract shutdown() : void;
    abstract action(user: User, message: string, payload: any) : void;

    constructor(title: string, listenFor: string[], maxPlayers: number = Infinity) {
        this.title = title;
        this.listenFor = listenFor;

        this.players = new LinkedList<User>();
    }

    public initialize(lightShow: LightShow) {
        this.lightShow = lightShow;
        this.setup()
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