import React, { Component } from 'react'
import * as THREE from "three";

import {OBJLoader2} from 'three/examples/jsm/loaders/OBJLoader2'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:2567', {path: '/admin'});

export default class ManageGame extends Component {

    componentDidMount() {
        const canvas = this.mount;
        const renderer = new THREE.WebGLRenderer({canvas});

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 10, 20);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 5, 0);
        controls.update();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('black');


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
            scene.add(root);
            });
        }

        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
            renderer.setSize(width, height, false);
            }
            return needResize;
        }

        var arrowHelper;
        socket.on('players', (msg) => {
            if (msg instanceof Array) {
                msg.forEach(e => {
                    if (e.direction && e.position) {
                        console.log(e.direction);
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
            console.log(msg);
        })

        function render() {

            if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            }

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }

        render();
    }

    // componentDidMount() {
    //     // === THREE.JS CODE START ===
    //     this.height = window.innerHeight / 2;
    //     this.width = window.innerWidth;

    //     this.scene = new THREE.Scene();
        
    //     const fov = 45;
    //     const aspect = 2;  // the canvas default
    //     const near = 0.1;
    //     const far = 100;
    //     this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //     this.camera.position.set(0, 10, 20);

    //     var ambient = new THREE.AmbientLight( 0x444444 );
    //     this.scene.add( ambient );

    //     const skyColor = 0xB1E1FF;  // light blue
    //     const groundColor = 0xB97A20;  // brownish orange
    //     const intensity = 1;
    //     const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    //     this.scene.add(light);

    //     var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    //     directionalLight.position.set( 0, 0, 1 ).normalize();
    //     this.scene.add( directionalLight );

    //     var objectLoader = new OBJLoader2();
    //     // objectLoader.load( "http://localhost:2567/layout/scene", ( obj ) => {
    //     //     this.scene.add( obj );
    //     // },
    //     // (xhr) => {
    //     //     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    //     // });

    //     objectLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj', (root) => {
    //         this.scene.add(root);
    //       },
    //     (xhr) => {
    //         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    //     });
				
    //     this.renderer = new THREE.WebGLRenderer();
    //     this.renderer.setPixelRatio( window.devicePixelRatio );
    //     this.renderer.setSize( this.width, this.height );

    //     this.mount.appendChild( this.renderer.domElement );

    //     const controls = new OrbitControls(this.camera, this.mount);
    //     controls.target.set(0, 5, 0);
    //     controls.update();
        
    //     this.animate();
    //     // === THREE.JS EXAMPLE CODE END ===
    // }

    // animate() {
    //     this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
    //     this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05;
    //     this.camera.lookAt( this.scene.position );
    //     this.renderer.render( this.scene, this.camera );

    //     requestAnimationFrame( this.animate.bind(this) );
    // }

    render() {
        return (
            <div className="visualizer" >
                <canvas ref={ref => (this.mount = ref)}></canvas>
            </div>
        ); 
    }
}