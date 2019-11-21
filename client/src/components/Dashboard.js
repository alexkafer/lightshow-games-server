
import React from 'react'
import ConnectionStatus from './ConnectionStatus'
import ViewGame from './ViewGame'

import { connect } from "react-redux";
import { getGame } from "../redux/selectors"
import { startGame } from "../redux/actions";

import SocketContext from '../services/socket-context';

import { Container, Button } from 'react-bootstrap'

import wandIcon from '../magic-wand.svg'
import noneIcon from '../logo.svg'

class Dashboard extends React.Component {
    constructor({currentGame, placeInLine}) {
        super();

        this.state = {
            game: currentGame,
            place: placeInLine,
            instructions: ''
        };
    }

    componentDidMount() {
        if (this.state.place === -1 || this.state.place === undefined) {
            this.setState({
                instructions:  "Error! Make sure you're connected to the internet"
            })
        } else if (this.state.place === 0) {
            this.setState({
                instructions:  "Press play to start"
            })
        } else if (this.state.place === 1) {
            this.setState({
                instructions:  "You're next in line!"
            })
        } else {
            this.setState({
                instructions:  "There are " + this.state.place + " people ahead of you"
            })
        }
    }

    render() {
        return (<>
            <div className="large-header">
                <ConnectionStatus connected={this.props.socket.connected}/>
                <ViewGame logo={this.state.game === "Wand" ? wandIcon : noneIcon} />
            </div>
            <div className="dashboard-body">
                <Container>
                    <h1>Wand</h1>
                    <div className="queue p-5">
                        <p>
                            {this.state.instructions}
                        </p>
                        <Button variant={this.state.place === 0 ? "primary" : "secondary"} size="lg" block disabled={this.state.place !== 0}>Play</Button>
                    </div>
                    
                </Container>
            </div>
        </>);
    }
}


const mapStateToProps = state => {
    return getGame(state);
}

const mapDispatchToProps = dispatch => {
    return {
      // dispatching plain actions
      startGame: () => dispatch(startGame()),
    }
}

const DashboardWithSocket = props => (
    <SocketContext.Consumer>
    {socket => <Dashboard {...props} socket={socket} />}
    </SocketContext.Consumer>
  )

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWithSocket);