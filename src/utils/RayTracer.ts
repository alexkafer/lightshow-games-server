import {Scene, PerspectiveCamera, Vector3, Raycaster } from 'three';
import User from './User';

export default class RayTracer {

    threshold = 0.1;

    raycaster: Raycaster;

    constructor(){
        this.raycaster = new Raycaster();
        this.raycaster.params.Points.threshold = this.threshold;
    }

    public castRay(scene: Scene, user: User): Vector3 | undefined  {
        if (!user.position || !user.direction) {
            return undefined;
        }

        const camera = new PerspectiveCamera();
        camera.position.set(user.position.x, user.position.y, user.position.z)
        camera.lookAt(camera.position.add(user.direction));

        // Get back position/rotation/scale attributes
        camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
        this.raycaster.setFromCamera( {x: user.mouseX, y: user.mouseY}, camera );

        const intersections = this.raycaster.intersectObjects( scene.children );
        const intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

        if (intersection !== null) {
            return intersection.point;
        }
    }
}