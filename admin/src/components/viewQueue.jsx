import React, { Component } from 'react'

import {Button, Table} from 'react-bootstrap'

import axios from 'axios'

export default class ManageGame extends Component {

    constructor() {
        super()

        this.state = {
            queue: []
        }
    }
    componentDidMount() {
        this.getQueue()
    }

    getQueue = async () => {
        let res = await axios.get("/games/queue");

        if (res.data.success) {
            this.setState(res.data);
        }
    };

    render() {

        let queue;
        
        if (this.state.queue.length === 0) {
            queue = (<tr>
                <td>Loading...</td>
                <td></td>
            </tr>)
        } else {
            queue = this.state.registered.map((e, i) => {
                return (<tr key={i}>
                            <td>{i}</td>
                            <td>{e}</td>
                        </tr>)
            
            });
        }

        return (
        <div>
            <h1>Current Game: {this.state.current}</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Number</th>
                    <th>Socket</th>
                    </tr>
                </thead>
                <tbody>
                    {queue}
                </tbody>
                </Table>

            
            
        </div>
        )
    }
}