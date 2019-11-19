import React from 'react'
import { connect } from "react-redux";
import { getPermissions } from "../redux/selectors";
import { askedForMotion } from "../redux/actions";

import ApprovalButton from '../components/ApprovalButton'

import { askForPermission } from '../services/motion_service'

const MotionPage = ({motion, askedForMotion}) => {

  var task;
  if (motion) {
    task = <h1>Success</h1>
  } else {
    task = <ApprovalButton 
              title="Activate Motion"
              description="Motion allows the light show to know where your phone is pointed."
              button="Activate"
              callback={() => {
                askForPermission().then(askedForMotion);
              }}
              override={askedForMotion}
            />
  }
  return (
    <div className="page">
      {task}
    </div>
  )
}

const mapStateToProps = state => {
  return getPermissions(state);
}

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    askedForMotion: () => dispatch(askedForMotion()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MotionPage);