
import React from 'react'
import ConnectionStatus from './ConnectionStatus'
import ViewGame from './ViewGame'

import { Container, Button } from 'react-bootstrap'

const Dashboard = () => {
    const playable = true;

    var instructions;
    if (playable) {
        instructions = "Press play to start";
    } else {
        instructions = "You are currently 5th in line";
    }

    const connected = true;

  return (
    <>
        <div className="large-header">
            <ConnectionStatus status={connected ? "Connected" : "Disconnected"} color={connected ? "green" : "red"}/>
            <ViewGame />
        </div>
        <div className="dashboard-body">
            <Container>
                <h1>Wand</h1>
                <div className="queue p-5">
                    <p>
                        {instructions}
                    </p>
                    <Button variant={playable ? "primary" : "secondary"} size="lg" block disabled={!playable}>Play</Button>
                </div>
                
            </Container>
        </div>
    </>
  )
}

export default Dashboard