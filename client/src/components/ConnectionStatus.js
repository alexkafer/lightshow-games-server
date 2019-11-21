import React from 'react'

contextTypes = {
    socket: PropTypes.object.isRequired,
  }

const ConnectionStatus = ({status, color}) => {

  return (
    <div className="header-connection d-flex align-items-center">
        <span className="p-1 pr-2">{status}</span> <span className={"dot " + color}></span>
    </div>
  )
}

export default ConnectionStatus

export default class ConnectionStatus extends Component {

    constructor(props) {
        super(props);

        this.state = {connected: false};
    }
 
    contextTypes = {
      socket: PropTypes.object.isRequired,
    }
   
    componentDidMount() {
      this.context.socket.on('bootstrap', (data) => this.handleDataBootstrap(data));
      this.context.socket.on('event', (data) => this.handleDataIncremental(data));
      this.context.socket.emit('bootstrap', { duration: Moment.duration(1, 'h') } );
    }
   
    handleDataBootstrap(data) {
      // Handle your bootstrap data package to set up the component.
      this.setState({foo: data.foo});
    }
   
    handleDataIncremental(data) {
      // Merge the new event
      const newFoo = this.mergeFoo(this.state.foo, data);
      this.setState({foo: newFoo});
    }
   
    mergeFoo(base, increment) {
      // merge data
    }
    // ...

    render() {
        return (
            <div className="header-connection d-flex align-items-center">
                <span className="p-1 pr-2">{this.state.connected ? "Connected" : "Disconnected"}</span> <span className={"dot " + this.state.connected ? "green" : "red"}></span>
            </div>
          )
    }
  }