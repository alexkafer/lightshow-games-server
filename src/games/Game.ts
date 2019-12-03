import Player from './Player'
import LightShow from '../LightShow';
import UserManager from '../PlayerManager';

export default abstract class Game {
    public title: string;
    public listenFor: string[];
    public playerMax: number;

    protected lightShow: LightShow;
    protected userManager: UserManager;

    abstract setup() : void;
    abstract loop() : void;
    abstract shutdown() : void;
    abstract action(user: Player, message: string, payload: any) : void;

    constructor(lightShow: LightShow, title: string, listenFor: string[], playerMax: number = Infinity) {
        this.title = title;
        this.listenFor = listenFor;
        this.playerMax = playerMax;
        this.lightShow = lightShow;
    }

    public initialize(userManager: UserManager) {
        this.userManager = userManager;
        this.setup();
    }
}