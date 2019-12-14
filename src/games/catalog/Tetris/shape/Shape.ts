import { ShapeType } from './ShapeType';
import { Vector2 } from "three";
import { PixelMap } from '../../../../utils/PixelMap';

export class Shape {

    // ------Members------//

    private _cells: Vector2[] = [];

    // X is the column. Y is the row.
    private _origin: Vector2 = null;
    private _shapeType: ShapeType;

    // ------Properties------//

    public get shapeType() : ShapeType {
        return this._shapeType;
    }

    public get cells() : Vector2[] {
        return this._cells;
    }
    public set cells(cells : Vector2[]) {
        this._cells = cells;
    }

    public get origin() : Vector2 {
        return this._origin;
    }


    // ------Constructor------//

    constructor(shapeType: ShapeType, cells: Vector2[], origin: Vector2) {
        this._shapeType = shapeType;
        this._cells = cells;
        this._origin = origin;
    }

    // ------Public Methods------//

    public isPartOfShape(cell: Vector2) {
        return this._cells.some(shapeCell => shapeCell.x === cell.x && shapeCell.y === cell.y);
    }

    public move(x: number = 0, y: number = 0) {
        if(this._origin){
            this._origin.add(new Vector2(x, y))
        }

        this.cells.forEach(cell => cell.add(new Vector2(x, y)));
    }

    public clearShape(pixelMap: PixelMap): void {
        this.cells.forEach(cell => {
            pixelMap.clearPixel(cell.y, cell.x);
        });
    }

    public fillShape(pixelMap: PixelMap): void {
        this.cells.forEach(cell => {
            pixelMap.fillPixel(cell.y, cell.x);
        });
    }
}