import React from 'react'
import { connect } from "react-redux";
import { logDeviceMotion, logDeviceOrientation } from "../redux/actions";
import { getOrientation } from '../redux/selectors';

class Manual extends React.Component {

    constructor(props) {
        super(props);
        
        this.handleMotionEvent = this.handleMotionEvent.bind(this);
        this.handleOrientationEvent = this.handleOrientationEvent.bind(this);
    }
    
    handleMotionEvent(event) {

        socket.emit('motion', event);

        // var payload = {
        //     x: event.accelerationIncludingGravity.x,
        //     y: event.accelerationIncludingGravity.y,
        //     z: event.accelerationIncludingGravity.z
        // };

        // this.props.logDeviceMotion(payload);
    }

    handleOrientationEvent(event) {

        var payload = {
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma,
            compass: event.webkitCompassHeading,
            compass_accuracy: event.webkitCompassAccuracy
        };

        socket.emit('orientation', payload);

        // this.setState(payload)

        // this.props.logDeviceOrientation(payload);
    }

    componentDidMount () {

        window.addEventListener("deviceorientation", this.handleOrientationEvent, true);   

        // Could use device motion for dead recking
        window.addEventListener("devicemotion", this.handleMotionEvent, true);   
    }

    componentWillUnmount () {
        window.removeEventListener("deviceorientation", this.handleOrientationEvent, true);  
        window.removeEventListener("devicemotion", this.handleMotionEvent, true);
    }

    render() {
        return (
            <div>
                <strong>Motion</strong>
                <p>
                    x: {this.props.x.toFixed(2)}
                </p>
                <p>
                    y: {this.props.y.toFixed(2)}
                </p>
                <p>
                    z: {this.props.z.toFixed(2)}
                </p>

                <strong>Orientation</strong>
                <p>
                    alpha: {this.props.alpha.toFixed(2)}
                </p>
                <p>
                    beta: {this.props.beta.toFixed(2)}
                </p>
                <p>
                    gamma: {this.props.gamma.toFixed(2)}
                </p>
                <p>
                    compass heading: {this.props.compass.toFixed(2)} +- {this.props.compass_accuracy.toFixed(2)}
                </p>
            </div>
        );
    } 
}

const mapStateToProps = state => {
    return getOrientation(state);
}
  
const mapDispatchToProps = dispatch => {
    return {
      // dispatching plain actions
      logDeviceOrientation: () => dispatch(logDeviceOrientation()),
      logDeviceMotion: () => dispatch(logDeviceMotion()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Manual);