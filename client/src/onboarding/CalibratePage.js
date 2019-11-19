import React from 'react'

import ApprovalButton from '../components/ApprovalButton'

const CalibratePage = () => {
  return (
    <div className="page">
      <ApprovalButton 
        title="Calibrate Direction"
        description="Point phone at the Block M"
        button="Calibrate"
        callback={() => console.log("Calibrated!")}
        override={() => console.log("Location!")}
      />
    </div>
  )
}

export default CalibratePage