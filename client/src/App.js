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
      currentGame
    }

    socket.on('game', (message) => {
      if (message === "Wand") {
        loadGame({
          game: <Wand />
        })
      }
    });

    socket.on('queue', (message) => {
      updateQueue(message)
    });
  }

  componentDidMount() {
    if (!this.state.inGame || !this.state.currentGame) {
      this.setState({
        currentGame: <Dashboard />
      });
    }
  }

  render() {
    return (
      <SocketContext.Provider value={socket}>
        <main role='main'>
          {this.state.currentGame}
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
