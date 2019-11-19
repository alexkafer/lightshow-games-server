import React from 'react'

import {Button} from 'react-bootstrap'

const ApprovalButton = ({title, description, button, callback, override}) => {
  return (
    <div className="container center-item">
        <h1 className='mt-5'>{title}</h1>
        <p className='lead'>{description}</p>
        <Button onClick={callback} variant="primary">{button}</Button>
        <Button onClick={override} variant="secondary">(debug)</Button>
      </div>
  )
}

export default ApprovalButton