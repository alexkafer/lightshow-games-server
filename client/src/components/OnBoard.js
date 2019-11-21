import React from 'react'

import ReactSwipe from 'react-swipe'

import LocationPage from '../onboarding/LocationPage'
import MotionPage from '../onboarding/MotionPage'
import CalibratePage from '../onboarding/CalibratePage'

const OnBoard = ({reactSwipeEl}) => {
  return (
    <>
      <ReactSwipe
        className="carousel"
        swipeOptions={{ continuous: false }}
        ref={el => (reactSwipeEl = el)}
        style={{
          wrapper: {
            height: "100%"
          }
        }}
        >

        <MotionPage/>
        <LocationPage/>
        <CalibratePage />
    
      </ReactSwipe>
      <footer className='footer mt-auto py-3 bg-dark text-white'>
          <Container>
            <div className="d-flex justify-content-between">
              <Button onClick={() => reactSwipeEl.prev()} variant="secondary">Prev</Button>
              <h4>Test</h4>
              <Button onClick={() => reactSwipeEl.next()} variant="primary">Next</Button>
            </div>
          </Container>
      </footer>
    </>
  )
}

export default OnBoard