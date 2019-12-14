import { ShapeType } from "./ShapeType";
import { Shape } from "./Shape";
import { Vector2 } from "three";

export class ShapeFactory {

    // ------Public Methods------//

    public createShape(shapeType: ShapeType, position: Vector2, margin: number = 1): Shape {

        let shapeCells: Vector2[] = [];
        let shapeOrigin: Vector2;

        switch(shapeType) {
            case ShapeType.I:
                shapeCells = [
                    new Vector2(position.x, position.y - 1 * margin),
                    new Vector2(position.x, position.y),
                    new Vector2(position.x, position.y + 1 * margin),
                    new Vector2(position.x, position.y + 2 * margin)
                ];
                shapeOrigin = new Vector2(position.x, position.y);
                break;
            case ShapeType.J:
                shapeCells = [
                    new Vector2(position.x, position.y - 1 * margin),
                    new Vector2(position.x, position.y),
                    new Vector2(position.x, position.y + 1 * margin),
                    new Vector2(position.x - 1 * margin, position.y + 1 * margin),
                ];
                shapeOrigin = new Vector2(position.x, position.y);
                break;
            case ShapeType.L:
                shapeCells = [
                    new Vector2(position.x, position.y - 1 * margin),
                    new Vector2(position.x, position.y),
                    new Vector2(position.x, position.y + 1 * margin),
                    new Vector2(position.x + 1 * margin, position.y + 1 * margin),
                ];
                shapeOrigin = new Vector2(position.x, position.y);
                break;
            case ShapeType.O:
                shapeCells = [
                    new Vector2(position.x - 1 * margin, position.y),
                    new Vector2(position.x, position.y),
                    new Vector2(position.x, position.y + 1 * margin),
                    new Vector2(position.x - 1 * margin, position.y + 1 * margin),
                ];
                shapeOrigin = null;
                break;
            case ShapeType.S:
                shapeCells = [
                    new Vector2(position.x, position.y),
                    new Vector2(position.x + 1 * margin, position.y),
                    new Vector2(position.x, position.y + 1 * margin),
                    new Vector2(position.x - 1 * margin, position.y + 1 * margin),
                ];
                shapeOrigin = new Vector2(position.x, position.y + 1 * margin);
                break;
            case ShapeType.Z:
                shapeCells = [
                    new Vector2(position.x, position.y),
                    new Vector2(position.x - 1 * margin, position.y),
                    new Vector2(position.x, position.y + 1 * margin),
                    new Vector2(position.x + 1 * margin, position.y + 1 * margin),
                ];
                shapeOrigin = new Vector2(position.x, position.y + 1 * margin);
                break;
            case ShapeType.T:
                shapeCells = [
                    new Vector2(position.x, position.y),
                    new Vector2(position.x, position.y + 1 * margin),
                    new Vector2(position.x - 1 * margin, position.y + 1 * margin),
                    new Vector2(position.x + 1 * margin, position.y + 1 * margin),
                ];
                shapeOrigin = new Vector2(position.x, position.y + 1 * margin);
                break;
        }

        return new Shape(shapeType, shapeCells, shapeOrigin);
    }
}