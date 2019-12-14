import { IChannelInterface, PIXEL_GRID_START, PIXEL_GRID_COLUMNS, PIXEL_GRID_ROWS } from "../LightManager";

export class PixelMap {

    // ------Members------//

    private _map: number[][];
    private _rows: number;
    private _columns: number;

    // ------Properties------//

    public get rows() : number {
        return this._rows;
    }

    public get columns() : number {
        return this._columns;
    }

    // ------Constructor------//

    constructor() {
        this._map = [];
        this._rows = PIXEL_GRID_ROWS;
        this._columns = PIXEL_GRID_COLUMNS;
    }

    // ------Public Methods------//

    public init(): void{
        for(let column: number = 0 ; column < this._columns ; column++ ){
            this._map[column] = [];

            for(let row: number = 0 ; row < this._rows ; row++){
                this._map[column][row] = 0;
            }
        }
    }

    public isInMap(row: number, column: number) {
        return row >= 0 && row < this._rows && column >= 0 && column < this._columns;
    }

    public isPixelOn(row: number, column: number): boolean {
        return this.isInMap(row, column) && this._map[column][row] > 0;
    }

    public isColumnFilled(column: number): boolean {
        return this._map[column].every(cell => cell > 0);
    }

    public clearPixel(row: number, column: number): void {
        if(this.isInMap(row, column)) {
            this._map[column][row] = 0;
        }
    }

    public fillPixel(row: number, column: number): void {
        if(this.isInMap(row, column)){
            this._map[column][row] = 255;
        }
    }

    public displayPixels(lightshow: IChannelInterface) {
        for (let column = 0; column < this._columns; column++) {
            for (let row = 0; row < this._rows; row++) {
                const channel = PIXEL_GRID_START + 10*column + 2*row;
                const value = this._map[column][row];

                lightshow.setChannel(channel, value);
                lightshow.setChannel(channel+1, value);
            }
        }
    }

    // Tetris
    public removeColumnAndShiftRight(column: number) {
        this._map.splice(column,1);

        const newRow: number[] = [];
        for(let j = 0 ; j < this._columns ; j++) {
            newRow[j] = 0
        }

        this._map.unshift(newRow);
    }

    public checkAnyFilled(column: number) {
        return this._map[column].some((v) => v > 0);
    }
}