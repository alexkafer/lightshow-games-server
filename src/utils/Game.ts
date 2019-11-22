import User from './User'
import LightShow from '../LightShow';

export default abstract class Game {
    public title: string;
    public listenFor: string[];

    protected lightShow: LightShow;

    private playerMax: number;
    protected players: Map<string, User>

    abstract setup() : void;
    abstract loop() : void;
    abstract shutdown() : void;
    abstract action(user: User, message: string, payload: any) : void;

    constructor(lightShow: LightShow, title: string, listenFor: string[], playerMax: number = Infinity) {
        this.title = title;
        this.listenFor = listenFor;

        this.playerMax = playerMax;
        this.players = new Map<string, User>();

        this.lightShow = lightShow;
    }

    public addPlayer(user: User): boolean {
        if (this.players.size < this.playerMax) {
            this.players.set(user.currentSocket.id, user);
            return true;
        } else {
            return false;
        }
    }

    public disconnected(user: User) {
        if (this.players.has(user.currentSocket.id)) {
            this.players.delete(user.currentSocket.id);
        }
    };
}