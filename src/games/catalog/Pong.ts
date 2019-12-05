import Game from '../Game'
import Player from "../Player"
import { IScene, NETLIGHT_START, NETLIGHT_ROWS, NETLIGHT_COLUMNS} from '../../LightManager';

import logger from '../../utils/Logger';

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

    constructor(scene: IScene) {
        super(lightShow, "Pong", ['up', 'down'], 2);
        this.logicTick = 0;
    }

    private resetGame() {
        this.leftPaddle = 2;
        this.rightPaddle = 2;

        this.ballDirX = Direction.Pos;
        this.ballDirY = Direction.None;

        this.ballPosY = 5;
        this.ballPosX = 2;

        this.leftScore = 0;
        this.rightScore = 0;
    }

    setup(): void {
        logger.info("Starting pong");
        this.lightShow.allOn();
        this.resetGame();
    }

    loop(): void {
        if (this.showingMessage) {
            // If showing a message, pause the game
            return;
        }

        const players = this.players.getPlayers();

        if (players.length < 2) {
            this.showPong();
            this.resetGame();
        } else {
            this.leftPlayer = players[0].currentSocket.id;
            this.rightPlayer = players[1].currentSocket.id;

            // Logic, every 10th game loop
            if (this.logicTick === 0) {
                this.moveBall();

                if (this.ballPosX < 0) { // If past the left side
                    logger.info("Ball hit left")
                    if (this.ballPosX > this.leftPaddle && this.ballPosX < this.leftPaddle + 1) {
                        this.ballDirX = Direction.Pos;
                        this.ballDirY = this.calculateBallReflection(Math.round(this.ballPosX) === this.leftPaddle);
                    } else {
                        // Score!
                        this.leftScore++;
                        this.ballPosY = 5;
                        this.ballPosX = 2;
                        this.showScore();
                    }
                } else if (this.ballPosX > 11) {  // If past the right side
                    logger.info("Ball hit right")
                    if (this.ballPosX > this.rightPaddle && this.ballPosX < this.rightPaddle + 1) {
                        this.ballDirX = Direction.Neg;
                        this.ballDirY = this.calculateBallReflection(Math.round(this.ballPosX) === this.rightPaddle);
                    } else {
                        // Score!
                        this.rightScore++;
                        this.ballPosY = 5;
                        this.ballPosX = 2;
                        this.showScore();
                    }
                } else if (this.ballPosY < 0) {   // If above the top
                    logger.info("Ball hit top")
                    // Reflect bottom
                    this.ballDirY = Direction.Pos;
                    this.ballPosY = 1;
                } else if (this.ballPosY > 4) {  // If below the bottom
                    logger.info("Ball hit bottom")
                    // Reflect top!
                    this.ballDirY = Direction.Neg;
                    this.ballPosY = 3;
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
                this.leftPaddle = Math.max(this.leftPaddle - 1, 0);
                logger.info("Moving left up: " + this.leftPaddle);
            }

            if (user.currentSocket.id === this.rightPlayer) {
                logger.info("Moving right up: " + this.rightPaddle);
                this.rightPaddle = Math.max(this.rightPaddle - 1, 0);
            }
        }

        if (message === "down") {
            if (user.currentSocket.id === this.leftPlayer) {
                logger.info("Moving left down: " + this.leftPaddle);
                this.leftPaddle = Math.min(this.leftPaddle + 1, 3);
            }

            if (user.currentSocket.id === this.rightPlayer) {
                logger.info("Moving right down: " + this.rightPaddle);
                this.rightPaddle = Math.min(this.rightPaddle + 1, 3);
            }
        }
    }

    private async showScore() {
        this.showingMessage = true;
        logger.info("Score is " + this.leftScore + " " + this.rightScore);
        await this.lightShow.displayPixelMessage(this.leftScore + " " + this.rightScore, 1000);
        this.showingMessage = false;
    }

    private async showPong() {
        this.showingMessage = true;
        await this.lightShow.displayPixelMessage("Pong!", 2000);
        this.showingMessage = false;
    }

    private moveBall() {
        logger.info("ball is pointed " + this.ballDirX + " " + this.ballDirY);
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

        logger.info("ball is now at " + this.ballPosX + " " + this.ballPosY);
    }

    private calculateBallReflection(top: boolean) {
        logger.info("reflecting ball");
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

        if (column === this.ballPosY && row === this.ballPosX) {
            return 255;
        }

        return 0;
    }
}