import React from 'react'

import ReactSwipe from 'react-swipe'

import LocationPage from '../onboarding/LocationPage'
import MotionPage from '../onboarding/MotionPage'
import CalibratePage from '../onboarding/CalibratePage'

const OnBoard = ({reactSwipeEl}) => {
  return (
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
  )
}

export default OnBoard