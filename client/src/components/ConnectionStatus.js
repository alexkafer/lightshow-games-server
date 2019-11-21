import React from 'react'

const ConnectionStatus = ({connected}) => {
  return (
    <div className="header-connection d-flex align-items-center">
      <span className="p-1 pr-2">{connected ? "Connected" : "Disconnected"}</span> <span className={"dot " + (connected ? "green" : "red")}></span>
    </div>
  );
}

export default ConnectionStatus