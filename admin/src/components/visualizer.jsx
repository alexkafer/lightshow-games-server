import React, { Component } from 'react'
import * as THREE from "three";

import axios from 'axios'

import {OBJLoader2} from 'three/examples/jsm/loaders/OBJLoader2'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:2567', {path: '/admin'});

export default class ManageGame extends Component {

    componentDidMount() {
        var mouse = new THREE.Vector2();
        var adding = true;
        var model;

        const canvas = this.mount;
        const renderer = new THREE.WebGLRenderer({canvas});

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 200;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 10, 20);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 5, 0);
        controls.update();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('black');

        const raycaster = new THREE.Raycaster();
        const composer = new EffectComposer( renderer );
        composer.addPass( new RenderPass( scene, camera ) );
        const outlinePass = new OutlinePass(new THREE.Vector2(canvas.clientWidth,canvas.clientHeight), scene, camera);
        outlinePass.renderToScreen = true;
        composer.addPass( outlinePass );

        var lights = new THREE.Group();
        scene.add(lights);

        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 0.5;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            scene.add(light);
        }

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 10, 0);
            light.target.position.set(-5, 0, 0);
            scene.add(light);
            scene.add(light.target);
        }

        

        {
            const objLoader = new OBJLoader2();
            objLoader.load('http://localhost:2567/layout/scene', (root) => {
                model = root;
                scene.add(root);
            });
        }

        var markerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000}));
        scene.add(markerMesh);
        
        canvas.addEventListener( 'mousemove', onMouseMove, false );
        canvas.addEventListener( 'mouseup', onMouseUp, false );
        canvas.addEventListener( 'mousedown', onMouseDown, false );
        
        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
                composer.setSize(width, height, false);
            }
            return needResize;
        }

        function onMouseMove( event ) {
            event.preventDefault();

            mouse.x = ( event.layerX / canvas.clientWidth ) * 2 - 1;
            mouse.y = - ( event.layerY / canvas.clientHeight ) * 2 + 1;

            adding = false;
        }

        function onMouseDown( event ) {
            adding = true;
        }


        function onMouseUp( ) {
            if (adding) {
                raycaster.setFromCamera( mouse, camera );

                if (model) {
                    var intersects = raycaster.intersectObjects( [model, lights], true);
                
                    if ( intersects.length > 0 && intersects[0].object.parent === model) {
                        const newLightPos = intersects[0].point;

                        console.log("Submitting new light:", newLightPos);

                        axios.post("/layout/lights", {
                            x: newLightPos.x,
                            y: newLightPos.y,
                            z: newLightPos.z,
                            channel: 5
                        }).then((res) => {
                            handleLights(res.data);
                        }); 
                    }
                }
            }
        }

        const updateLights = async () => {
            for (var i = lights.children.length - 1; i >= 0; i--) {
                lights.remove(lights.children[i]);
            }

            let res = await axios.get("/layout/lights");

            handleLights(res.data);
        };

        function handleLights(lightsArray) {
            if (lightsArray instanceof Array) {
                console.log(lightsArray);
                lightsArray.forEach((light) => {
                    var lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffffff}));
                    lights.add(lightMesh);
                    lightMesh.position.set(light.position.x, light.position.y, light.position.z);
                    lightMesh.userData = light;
                    console.log("New light with id:", lightMesh.userData.id);
                })
            }
        }

        var arrowHelper;
        socket.on('players', (msg) => {
            if (msg instanceof Array) {
                msg.forEach(e => {
                    if (e.direction && e.position) {
                        var dir = new THREE.Vector3( e.direction.x, e.direction.y, e.direction.z );

                        //normalize the direction vector (convert to vector of length 1)
                        dir.normalize();
    
                        var origin = new THREE.Vector3( 0, 0, 0 );
                        var length = 1;
                        var hex = 0xffff00;
    
                        arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
                        scene.add( arrowHelper );
                    }
                });
            }
        })

        function handleIntersection(closest) {
            if (closest.object === markerMesh) {
                return;
            }

            for (var i = lights.children.length - 1; i >= 0; i--) {
                if (lights.children[i] === closest.object) {
                    markerMesh.visible = false;
                    outlinePass.selectedObjects = [lights.children[i]]
                    return;
                }
            }

            outlinePass.selectedObjects = []
            markerMesh.visible = true;
            markerMesh.position.copy(closest.point);
        }

        function render() {

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            raycaster.setFromCamera( mouse, camera );

            if (model) {
                var intersects = raycaster.intersectObjects( scene.children, true );
            
                if ( intersects.length > 0 ) {
                    if (intersects[0].object === markerMesh) {
                        if (intersects.length > 1) {
                            handleIntersection(intersects[1]);
                        }
                    } else {
                        handleIntersection(intersects[0]);
                    }
                }
            }

            composer.render(scene, camera);

            requestAnimationFrame(render);
        }

        render();
        updateLights();
    }

    render() {
        return (
            <div className="visualizer" >
                <canvas ref={ref => (this.mount = ref)}></canvas>
            </div>
        ); 
    }
}