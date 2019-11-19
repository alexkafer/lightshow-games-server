import React from 'react'

import ApprovalButton from '../components/ApprovalButton'

const LocationPage = () => {
  return (
    <div className="page">
      <ApprovalButton 
        title="Allow Location"
        description="Location allows us to pin point where you currently are."
        button="Activate"
        callback={() => console.log("Location!")}
        override={() => console.log("Location!")}
      />
    </div>
  )
}

export default LocationPage