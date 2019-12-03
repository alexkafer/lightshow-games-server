import React, { Component } from 'react'
import {Form, Button, Row, Col} from 'react-bootstrap'
import * as THREE from "three";

import axios from 'axios'

import {OBJLoader2} from 'three/examples/jsm/loaders/OBJLoader2'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import openSocket from 'socket.io-client';
const adminSocket = openSocket({path: '/admin'});
// const galliumSocket = openSocket({path: '/gallium',
//     query: {
//         token: 'lightshow2',
//     },
// });

export default class ManageGame extends Component {

    constructor() {
        super();

        this.state = {
            selectedLight: {
                id: null,
                channel: ''
            },
            lightChannel: 0
        }
    }

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

        var visitors = new THREE.Group();
        scene.add(visitors);

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
            objLoader.load('/layout/scene', (root) => {
                model = root;
                scene.add(root);
            });
        }

        var markerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000}));
        scene.add(markerMesh);
        
        const resizeRendererToDisplaySize = (renderer) => {
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

        const onMouseMove = ( event ) => {
            event.preventDefault();

            mouse.x = ( event.layerX / canvas.clientWidth ) * 2 - 1;
            mouse.y = - ( event.layerY / canvas.clientHeight ) * 2 + 1;

            adding = false;
        }

        const onMouseDown = ( event ) => {
            adding = true;
        }

        const onMouseUp = ( ) => {
            if (model) {
                raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects( [model, lights], true);

                if (intersects.length > 0) {
                    if ( intersects[0].object.parent === lights) {
                        const clickedLight = intersects[0].object.userData;

                        console.log("Clicked a light:", clickedLight);

                        this.setState({
                            selectedLight: clickedLight,
                            lightChannel: clickedLight.channel
                        })
                    } else if (adding && intersects[0].object.parent === model) {
                        const newLightPos = intersects[0].point;

                        console.log("Submitting new light:", newLightPos);

                        axios.post("/layout/lights", {
                            x: newLightPos.x,
                            y: newLightPos.y,
                            z: newLightPos.z,
                            channel: this.state.lightChannel
                        }).then((res) => {
                            this.setState({lightChannel: Number(this.state.lightChannel) + 1});
                            console.log("New Channel: " + this.state.lightChannel)
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

        const handleLights = (lightsArray) => {
            if (lightsArray instanceof Array) {
                lightsArray.forEach((light) => {
                    var lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffffff}));
                    lightMesh.name = "channel_" + light.channel;
                    lights.add(lightMesh);
                    lightMesh.position.set(light.position.x, light.position.y, light.position.z);
                    lightMesh.userData = light;
                })
            }
        }

        canvas.addEventListener( 'mousemove', onMouseMove, false );
        canvas.addEventListener( 'mouseup', onMouseUp, false );
        canvas.addEventListener( 'mousedown', onMouseDown, false );

        adminSocket.on('players', (msg) => {
            for (var i = visitors.children.length - 1; i >= 0; i--) {
                visitors.remove(visitors.children[i]);
            }

            if (msg instanceof Array) {
                msg.forEach(e => {
                    if (e.direction && e.position && e.id) {
                        var axis = new THREE.Vector3(0, -1, 0);

                        var visitorMesh = visitors.getObjectByName(e.id);
                        if (!visitorMesh) {
                            visitorMesh = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1), new THREE.MeshStandardMaterial({ color: 0x00ffff}));
                            visitorMesh.name = e.id;
                            visitorMesh.add(new THREE.ArrowHelper( axis,  new THREE.Vector3(0, 0, 0), 20, 0xffff00));
                            visitors.add( visitorMesh );
                        }
                
                        var dir = new THREE.Vector3( e.direction.x, e.direction.y, e.direction.z );
                        visitorMesh.quaternion.setFromUnitVectors(axis, dir.normalize());
                        visitorMesh.position.set(e.position.x, e.position.y, e.position.z)
                    }
                });
            }
        })

        // galliumSocket.on('frame', (frame) => {
        //     scene.traverse((child) => {
        //         if (child.userData.channel in frame) {
        //             child.material.color.setHSL(
        //                 child.userData.channel / 12, 
        //                 1, 
        //                 frame[child.userData.channel] / 255);
        //         }
        //     });
        // })

        const handleIntersection = (closest) => {
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

        const renderThree = () => {

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
            requestAnimationFrame(renderThree.bind(this));
        }

        renderThree();
        updateLights();

        this.deleteLight = () => {
            axios.delete("/layout/lights/" + this.state.selectedLight.id).then(() => {
                updateLights();
            });
        }
    
        this.updateChannel = () => {
            return axios.post("/layout/lights/" + this.state.selectedLight.id, {
                channel: this.state.lightChannel
            }).then(() => {
                updateLights();
            });
        }
    }

    handleChange(e){
        this.setState({
            lightChannel: e.target.value
        });
    }

    render() {
        return (
            <>
            <div className="light">
                <h4>{this.state.selectedLight.id ? this.state.selectedLight.id : "Select a light"}</h4>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="2">
                    Channel
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control size="lg" type="text" value={this.state.lightChannel} onChange={this.handleChange.bind(this)}/>
                    </Col>
                </Form.Group>
                <Button variant="primary" disabled={this.state.selectedLight.id == null} onClick={this.updateChannel}>
                    Save
                </Button>
                <Button variant="danger" disabled={this.state.selectedLight.id == null} onClick={this.deleteLight}>Delete</Button>
            </div>
            <div className="visualizer" >
                <canvas ref={ref => (this.mount = ref)}></canvas>
            </div>
            </>
        ); 
    }
}