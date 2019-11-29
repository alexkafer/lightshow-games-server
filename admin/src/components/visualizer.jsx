import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:2567', {path: '/admin'});

export default class ManageGame extends Component {

    render() {
        const game = {
            width: "100%",
            height: "100%",
            type: Phaser.AUTO,
            scene: {
                preload: function() {
                    this.load.svg('layout', 'http://localhost:2567/layout', {
                        scale: 2
                    });

                    this.load.image('wand', '/magic-wand.png');
                },
                init: function() {
                    this.cameras.main.setBackgroundColor('#fff')
                },
                create: function() {
                    this.background = this.add.image(0,0, 'layout');
                    this.background.setOrigin(0,0);

                    var graphics = this.add.graphics();

                    socket.on('position', pos => {
                        var circle = new Phaser.Geom.Circle(
                            pos.x * this.scale.width,
                            pos.y *this.scale.height,
                            5);
                        
                        graphics.fillStyle(0xFF0000, 1.0);
                        graphics.fillCircleShape(circle);
                    });

                    this.input.on('pointerdown', (pointer) => {
                        // this.add.image(pointer.x, pointer.y, 'wand');t
                        var circle = new Phaser.Geom.Circle(pointer.x, pointer.y, 5);

                        graphics.fillStyle(0x00FF00, 1.0);
                        graphics.fillCircleShape(circle);
                    });
                },
                update: function() {
                    // this.helloWorld.angle += 1;
                }
            }
          }

        return (
            <div className="visualizer" >
                <IonPhaser game={game} />
            </div>
        ); 
    }
}