import React from 'react'
import { connect } from "react-redux";
import { getPermissions } from "./redux/selectors";

import {Container, Button} from 'react-bootstrap'
import OnBoard from './components/OnBoard'

// import Manual from './games/Manual'

import './App.scss'
import Dashboard from './components/Dashboard';

const App = ({motion}) => {
  let reactSwipeEl;

  var mainAction;
  if (!motion) {
    mainAction = <OnBoard reactSwipeEl={reactSwipeEl}/>;
  } else {
    mainAction = <Dashboard />
  }

  mainAction = <Dashboard />
  
  return (
    <>
      <main role='main'>
          {mainAction}
      </main>
      {/* <footer className='footer mt-auto py-3 bg-dark text-white'>
          <Container>
            <div className="d-flex justify-content-between">
              <Button onClick={() => reactSwipeEl.prev()} variant="secondary">Prev</Button>
              <h4>Test</h4>
              <Button onClick={() => reactSwipeEl.next()} variant="primary">Next</Button>
            </div>
          </Container>
      </footer> */}
    </>
  );
}

// AppRegistry.registerComponent('App', () => App);
// AppRegistry.runApplication('App', { rootTag: document.getElementById('react-root') });
const mapStateToProps = state => {
  return getPermissions(state);
}

export default connect(mapStateToProps)(App);
