import Game from '../Game'
import Player from "../Player"
import LightShow, { NETLIGHT_START, NETLIGHT_ROWS, NETLIGHT_COLUMNS} from '../../LightShow';

import logger from '../../utils/Logger';
import { Vector2 } from 'three';

enum Direction {
    Pos = 1,
    None = 0,
    Neg = -1
}

export default class Pong extends Game {

    ballPosX: number;
    ballPosY: number;
    ballDirX: Direction;
    ballDirY: Direction;

    leftPlayer: string;
    rightPlayer: string;
    leftPaddle: number;
    rightPaddle: number;

    leftScore: number;
    rightScore: number;

    showingMessage: boolean;
    logicTick: number;

    constructor(lightShow: LightShow) {
        super(lightShow, "Pong", ['up', 'down'], 2);
        this.logicTick = 0;
    }

    setup(): void {
        logger.info("Starting pong");
    }

    loop(): void {
        if (this.showingMessage) {
            // If showing a message, pause the game
            return;
        }

        const players = this.players.getPlayers();

        if (players.length < 2) {
            this.showPong();
        } else {
            this.leftPlayer = players[0].currentSocket.id;
            this.rightPlayer = players[1].currentSocket.id;

            // Logic, every 10th game loop
            if (this.logicTick === 0) {
                this.moveBall();

                if (this.ballPosX === 0) {
                    if (this.ballPosX === this.leftPaddle) {
                        this.ballDirX = Direction.Pos;
                        this.ballDirY = this.calculateBallReflection(true);
                    } else if (this.ballPosX === this.leftPaddle + 1) {
                        // Reflect!
                        this.ballDirX = Direction.Pos;
                        this.ballDirY = this.calculateBallReflection(false);
                    } else {
                        // Score!
                        this.leftScore++;
                        this.showScore();
                    }
                } else if (this.ballPosX === 11) {
                    if (this.ballPosX === this.rightPaddle) {
                        // Reflect!
                        this.ballDirX = Direction.Neg;
                        this.ballDirY = this.calculateBallReflection(true);
                    } else if (this.ballPosX === this.rightPaddle + 1) {
                        // Reflect!
                        this.ballDirX = Direction.Neg;
                        this.ballDirY = this.calculateBallReflection(false);
                    } else {
                        // Score!
                        this.rightScore++;
                        this.showScore();
                    }
                }

                if (this.ballPosY === 0) {
                    // Reflect!
                    this.ballDirY = Direction.Neg;
                } else if (this.ballPosY === 4) {
                    // Score!
                    this.ballDirY = Direction.Pos;
                }

                this.logicTick = 10;
            } else {
                this.logicTick--;
            }

            // Renderer
            for (let column = 0; column < NETLIGHT_COLUMNS; column++) {
                for (let row = 0; row < NETLIGHT_ROWS; row++) {
                    const channel = NETLIGHT_START + 10*column + 2*row;

                    const value = this.getPixelAt(row, column);
                    this.lightShow.setChannel(channel, value);
                    this.lightShow.setChannel(channel+1, value);
                }
            }
        }
    }


    shutdown(): void {
        logger.info("Shutting down pong");
    }

    action(user: Player, message: string, payload: any): void {
        logger.info(message + "! " + JSON.stringify(payload));
        if (message === "up") {
            if (user.currentSocket.id === this.leftPlayer) {
                this.leftPaddle = Math.min(this.leftPaddle - 1, 0);
            }

            if (user.currentSocket.id === this.rightPlayer) {
                this.rightPaddle = Math.min(this.leftPaddle - 1, 0);
            }
        }

        if (message === "down") {
            if (user.currentSocket.id === this.leftPlayer) {
                this.leftPaddle = Math.max(this.leftPaddle + 1, 3);
            }

            if (user.currentSocket.id === this.rightPlayer) {
                this.rightPaddle = Math.max(this.leftPaddle + 1, 3);
            }
        }
    }

    private async showScore() {
        this.showingMessage = true;
        await this.lightShow.displayPixelMessage(this.leftScore + " " + this.rightScore, 1000);
        this.showingMessage = false;
    }

    private async showPong() {
        this.showingMessage = true;
        await this.lightShow.displayPixelMessage("Pong!", 1000);
        this.showingMessage = false;
    }

    private moveBall() {
        if (this.ballDirX === Direction.Pos) {
            this.ballPosX += 1
        }

        if (this.ballDirX === Direction.Neg) {
            this.ballPosX -= 1
        }

        if (this.ballDirY === Direction.Pos) {
            this.ballPosY += 1
        }

        if (this.ballDirY === Direction.Neg) {
            this.ballPosY -= 1
        }
    }

    private calculateBallReflection(top: boolean) {

        if (top) {
            if (this.ballDirY  === Direction.Pos) return Direction.None
            return Direction.Neg;
        } else {
            if (this.ballDirY  === Direction.Neg) return Direction.None
            return Direction.Pos;
        }
    }

    private getPixelAt(row: number, column: number): number {
        if (column === 0) {
            return (row === this.leftPaddle || row === this.leftPaddle+1) ? 255 : 0;
        }

        if (column === 11) {
            return (row === this.rightPaddle || row === this.rightPaddle+1) ? 255 : 0;
        }

        if (column === this.ballPosX && row === this.ballPosY) {
            return 255;
        }

        return 0;
    }
}