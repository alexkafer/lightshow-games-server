import logger from '../../utils/Logger';

import Game from '../Game'
import Player from "../Player"

import LightManager from '../../LightManager';

import { Shape } from './Tetris/shape/Shape';
import { ShapeType } from './Tetris/shape/ShapeType';
import { PixelMap } from '../../utils/PixelMap';
import { ShapeFactory } from './Tetris/shape/ShapeFactory';
import { Vector2 } from 'three';

// This game was forked from this repository:
// https://github.com/henshmi/Tetris.ts/tree/master/src
export default class Tetris extends Game {

    private pixelMap: PixelMap;
    private _movingShape: Shape = null;
    private _score: number;
    private _shapeFactory: ShapeFactory;

    player: string;
    showingMessage: boolean;
    logicTick: number;

    private _shapeTypes: ShapeType[] = [
        ShapeType.I,
        ShapeType.J,
        ShapeType.L,
        ShapeType.O,
        ShapeType.S,
        ShapeType.Z,
        ShapeType.T
    ];

    constructor(lightShow: LightManager) {
        super(lightShow, "Tetris", ['up', 'down', 'left', 'right'], 1);
        this.logicTick = 0;

        this._shapeFactory = new ShapeFactory();
        this.pixelMap = new PixelMap();
    }

    setup(): void {
        logger.info("Starting tetris");
        this.lightShow.allOn();
    }

    newGame(): void {
        this._score = 0;
        this.pixelMap.init();
        this._movingShape = this.spawnNewShape();
    }

    loop(): void {
        if (this.showingMessage) {
            // If showing a message, pause the game
            return;
        }

        const players = this.players.getPlayers();

        if (players.length < 1) {
            this.showTetris();
        } else {
            if (this.player === undefined) {
                this.player = players[0].currentSocket.id;
                this.newGame();
            }

            // Logic, every 10th game loop
            if (this.logicTick === 0) {
                const reachedBottom = this.lowerShape();

                if(reachedBottom) {
                    this._movingShape.fillShape(this.pixelMap);
                    this.removeFilledLines();

                    if(this.pixelMap.checkAnyFilled(0)){
                        this.showGameOver()
                        this.newGame();
                    } else {
                        this._movingShape = this.spawnNewShape();
                    }
                }

                this.logicTick = 7;
            } else {
                this.logicTick--;
            }

            // Show the moving shape, send to the render, and clear for next render
            this._movingShape.fillShape(this.pixelMap);
            this.pixelMap.displayPixels(this.lightShow);
            this._movingShape.clearShape(this.pixelMap);
        }
    }


    shutdown(): void {
        logger.info("Shutting down pong");
    }

    action(user: Player, message: string, payload: any): void {
        let toMoveRow = 0;

        if (message === "up") {
            toMoveRow = -1;
        }

        if (message === "down") {
            toMoveRow = 1;
        }

        if (message === "left") {
            this.rotateShape();
        }

        if (message === "right") {
            this.rotateShape(-1);
        }

        if(toMoveRow !== 0){

            const reachedBorder = this._movingShape.cells.some(cell => {
                const nextY = cell.y + toMoveRow;
                const partOfShape = this._movingShape.isPartOfShape(new Vector2(cell.x, cell.y + toMoveRow));
                return nextY < 0 || nextY >= this.pixelMap.rows ||
                    (this.pixelMap.isPixelOn(nextY, cell.x) && !partOfShape);
            });

            if(!reachedBorder) {
                this._movingShape.clearShape(this.pixelMap);
                this._movingShape.move(0, toMoveRow);
                this._movingShape.fillShape(this.pixelMap);
            }
        }
    }

    public removeFilledLines(): void {

        let filledLinesCount = 0;

        for (let column = 0 ; column < this.pixelMap.columns ; column++) {
            const filledLine : boolean = this.pixelMap.isColumnFilled(column);

            if(filledLine) {
                filledLinesCount++;
                this.pixelMap.removeColumnAndShiftRight(column);
            }
        }

        if(filledLinesCount > 0) {
            this.increaseScore(filledLinesCount);
        }
    }

    private async showGameOver() {
        this.showingMessage = true;
        logger.info("Score was " + this._score);
        await this.lightShow.displayPixelMessage("GAME OVER. SCORE " + this._score, 10000);
        this.showingMessage = false;
    }

    private lowerShape(): boolean {

        const reachedBottom = this._movingShape.cells.some(cell => {
            const nextX: number = cell.x + 1;
            const partOfShape = this._movingShape.isPartOfShape(new Vector2(nextX, cell.y));

            return nextX === this.pixelMap.columns || (this.pixelMap.isPixelOn(cell.y, nextX) && !partOfShape);
        });

        logger.info("Tetris, hit bottom?" + reachedBottom);

        if(!reachedBottom) {
            this._movingShape.clearShape(this.pixelMap);
            this._movingShape.move(1, 0);
            this._movingShape.fillShape(this.pixelMap);
        }

        return reachedBottom;
    }

    private async showTetris() {
        this.showingMessage = true;
        await this.lightShow.displayPixelMessage("Tetris!", 2500);
        this.showingMessage = false;
    }

    private increaseScore(toAdd: number) : void {
        this._score += toAdd;
    }

    private spawnNewShape(): Shape {
        const randomShapeTypeIndex = Math.floor(Math.random() * this._shapeTypes.length);

        return this._shapeFactory.createShape(
                    this._shapeTypes[randomShapeTypeIndex],
                    new Vector2(1, 2)
                );
    }

    private rotateShape(other = 1): void {
        if(!this._movingShape.origin){
            return;
        }

        const newShape = [];

        for(const cell of this._movingShape.cells) {
            const x = cell.x - this._movingShape.origin.x;
            const y = cell.y - this._movingShape.origin.y;
            const newX = other * -y;
            const newY = other * x;

            const newCell = new Vector2(this._movingShape.origin.x + newX, this._movingShape.origin.y + newY)
            newShape.push(newCell);
        }

        const possibleRotation = newShape.every(cell => {
            const partOfShape = this._movingShape.isPartOfShape(cell);
            return this.pixelMap.isInMap(cell.y, cell.x) &&
                (!this.pixelMap.isPixelOn(cell.y, cell.x) || partOfShape);
        });

        if(possibleRotation) {
            this._movingShape.clearShape(this.pixelMap);
            this._movingShape.cells = newShape;
            this._movingShape.fillShape(this.pixelMap);
        }
    }
}