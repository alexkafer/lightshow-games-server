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

    constructor(rows: number, columns: number) {
        this._map = [];
        this._rows = rows;
        this._columns = columns;
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

    public getPixels(): number[][] {
        return this._map;
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