import React from 'react'
import { connect } from "react-redux";
import { getGame } from "./redux/selectors";
import { updateQueue, loadGame } from "./redux/actions";

import Dashboard from './components/Dashboard';
import Wand from './games/Wand';

import SocketContext from './services/socket-context';
import openSocket from 'socket.io-client';

import './App.scss'

const socket = openSocket();

class App extends React.Component {
  constructor({inGame, currentGame, loadGame, updateQueue}) {
    super();

    this.state = {
      inGame,
      currentGame,
      action: <div>Error. Nothing loaded.</div>
    }

    socket.on('game', (game) => {
      console.log("Game: ", game);
      loadGame(game)
    });

    socket.on('queue', (place) => {
      console.log("Queue: ", place);
      updateQueue(place)
    });
  }

  componentDidMount() {
    if (!this.state.inGame) {
      this.setState({
        action: <Dashboard />
      });
    } else {
      var game;
      switch(this.state.currentGame) {
        case "Wand": 
          game = <Wand />
          break;
        default:
          game = <p>An error occurred. Please refresh and try again.</p>
      }

      this.setState({
        action: game
      });
    }
  }

  render() {
    return (
      <SocketContext.Provider value={socket}>
        <main role='main'>
          {this.state.action}
        </main>
      </SocketContext.Provider>
    );
  }
}


const mapStateToProps = state => {
  return getGame(state);
}

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    loadGame: () => dispatch(loadGame()),
    updateQueue: () => dispatch(updateQueue()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
