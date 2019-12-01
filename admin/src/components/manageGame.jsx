import React, { Component } from 'react'

import {Button, Table} from 'react-bootstrap'

import axios from 'axios'

export default class ManageGame extends Component {

    constructor() {
        super()

        this.state = {
            success: false,
            current: "",
            registered: []
        }
    }
    componentDidMount() {
        this.getGames()
    }

    getGames = async () => {
        let res = await axios.get("/games");

        if (res.data.success) {
            this.setState(res.data);
        }
    };

    startGame = async (game) => {
        await axios.post('/games', {game});

        this.getGames();
    }


    render() {

        let games;
        
        if (this.state.registered.length === 0) {
            games = (<tr>
                <td>Loading...</td>
                <td></td>
            </tr>)
        } else {
            games = this.state.registered.map((e, i) => {
                if (e === this.state.current.toUpperCase()) {
                    return (<tr key={i}>
                        <td>{e}</td>
                        <td></td>
                    </tr>)
                } else {
                    return (<tr key={i}>
                        <td>{e}</td>
                        <td><Button  variant="primary" onClick={() => this.startGame(e)}>Start</Button></td>
                    </tr>)
                }
            });
        }

        return (
        <div>
            <h1>Current Game: {this.state.current}</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Game</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games}
                </tbody>
                </Table>

            
            
        </div>
        )
    }
}