import React from 'react'
import ConnectionStatus from '../components/ConnectionStatus';

import SocketContext from '../services/socket-context';

class Wand extends React.Component {

    constructor(props) {
        super(props);
        
        // this.handleMotionEvent = this.handleMotionEvent.bind(this);
        this.handleOrientationEvent = this.handleOrientationEvent.bind(this);
        this.compassNeedsCalibration = this.compassNeedsCalibration.bind(this);
    }

    compassNeedsCalibration(event) {
        alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
        event.preventDefault();
    }
    
    // handleMotionEvent(event) {
    //     var payload = {
    //         x: event.accelerationIncludingGravity.x,
    //         y: event.accelerationIncludingGravity.y,
    //         z: event.accelerationIncludingGravity.z
    //     };

    //     this.props.logDeviceMotion(payload);
    // }

    handleOrientationEvent(event) {
        var payload = {
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma,
            compass: event.webkitCompassHeading,
            compass_accuracy: event.webkitCompassAccuracy
        };

        this.props.socket.emit('orientation', payload);
    }

    componentDidMount () {

        window.addEventListener("deviceorientation", this.handleOrientationEvent, true);   

        // Could use device motion for dead recking
        // window.addEventListener("devicemotion", this.handleMotionEvent, true);   
        window.addEventListener("compassneedscalibration", this.compassNeedsCalibration, true);
    }

    componentWillUnmount () {
        window.removeEventListener("deviceorientation", this.handleOrientationEvent, true);  
        window.removeEventListener("compassneedscalibration", this.compassNeedsCalibration, true);  
        // window.removeEventListener("devicemotion", this.handleMotionEvent, true);
    }

    render() {
        return (
            <>
                <nav class="navbar navbar-light bg-dark">
                    <span class="navbar-brand mb-0 h1">Wand</span>
                    <ConnectionStatus connected={this.socket.connected} />
                </nav>
                <div>
                    Now playing, Wand
                </div>
            </>
        );
    } 
}

const WandWithSocket = props => (
    <SocketContext.Consumer>
    {socket => <Wand {...props} socket={socket} />}
    </SocketContext.Consumer>
  )

export default WandWithSocket;