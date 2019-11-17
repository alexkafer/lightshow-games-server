import { Scene, Color, BufferGeometry, BufferAttribute, VertexColors, PointsMaterial, Points, SceneUtils } from 'three';

export default class PointCloudScene {

    pointSize = 0.05;

    scene: Scene;

    constructor(width: number = 80, length: number = 160) {
        this.scene = new Scene();

        const pc = this.generateIndexedPointcloud( new Color( 1, 0, 0 ), width, length );
        pc.scale.set( 50, 100, 100 );
        pc.position.set( 0, 0, 0 );
        this.scene.add( pc );
    }

    private generatePointCloudGeometry( color: Color, width: number, length: number ) {

        const geometry = new BufferGeometry();
        const numPoints = width * length;

        const positions = new Float32Array( numPoints * 3 );
        const colors = new Float32Array( numPoints * 3 );

        let k = 0;

        for ( let i = 0; i < width; i ++ ) {

            for ( let j = 0; j < length; j ++ ) {

                const u = i / width;
                const v = j / length;
                const x = u - 0.5;
                const z = v - 0.5;
                const y = 0.5 + x*x - z*z;

                positions[ 3 * k ] = x;
                positions[ 3 * k + 1 ] = y;
                positions[ 3 * k + 2 ] = z;

                const intensity = ( y + 0.1 ) * 5;
                colors[ 3 * k ] = color.r * intensity;
                colors[ 3 * k + 1 ] = color.g * intensity;
                colors[ 3 * k + 2 ] = color.b * intensity;

                k ++;

            }

        }

        geometry.setAttribute( 'position', new BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new BufferAttribute( colors, 3 ) );
        geometry.computeBoundingBox();

        return geometry;

    }

    private generatePointcloud( color: Color, width: number, length: number ) {

        const geometry = this.generatePointCloudGeometry( color, width, length );
        const material = new PointsMaterial( { size: this.pointSize, vertexColors: VertexColors } );

        return new Points( geometry, material );

    }

    private generateIndexedPointcloud( color: Color, width: number, length: number ) {

        const geometry = this.generatePointCloudGeometry( color, width, length );
        const numPoints = width * length;
        const indices = new Uint16Array( numPoints );

        let k = 0;

        for ( let i = 0; i < width; i ++ ) {

            for ( let j = 0; j < length; j ++ ) {

                indices[ k ] = k;
                k ++;

            }

        }

        geometry.setIndex( new BufferAttribute( indices, 1 ) );

        const material = new PointsMaterial( { size: this.pointSize, vertexColors: VertexColors } );

        return new Points( geometry, material );

    }
}