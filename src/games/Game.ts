import Player from './Player'
import LightShow from '../LightManager';
import PlayerManager from '../PlayerManager';

export default abstract class Game {
    public title: string;
    public listenFor: string[];
    public playerMax: number;

    protected lightShow: LightShow;
    protected players: PlayerManager;

    abstract setup() : void;
    abstract loop() : void;
    abstract shutdown() : void;
    abstract action(player: Player, message: string, payload: any) : void;

    constructor(lightShow: LightShow, title: string, listenFor: string[], playerMax: number) {
        this.title = title;
        this.listenFor = listenFor;
        this.playerMax = playerMax;
        this.lightShow = lightShow;
    }

    public initialize(playerManager: PlayerManager) {
        this.players = playerManager;
        this.setup();
    }
}