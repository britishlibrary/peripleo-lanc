import React, { useEffect, useState } from 'react';
import Joyride from 'react-joyride';

import tour from './tour';
import Welcome from './Welcome';

const BEEN_HERE_TOKEN = 'p6o-been-here';

export const isFirstTimeVisitor =
  !localStorage.getItem(BEEN_HERE_TOKEN);

const Tutorial = props => {

  const [ showWelcome, setShowWelcome ] = useState(true);

  const [ showTour, setShowTour ] = useState(false);

  useEffect(() => {
    if (isFirstTimeVisitor)
      localStorage.setItem(BEEN_HERE_TOKEN, true);
  }, []);

  const onStartTour = () => {
    setShowWelcome(false);
    setShowTour(true);
  }

  return (
    <>
      {showWelcome && 
        <Welcome
          onNoThanks={() => setShowWelcome(false)} 
          onTakeTour={onStartTour} />
      }

      {showTour &&
        <Joyride steps={tour} />
      }
    </>
  )

}

export default Tutorial;