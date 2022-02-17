import React, { useEffect, useState } from 'react';
import Joyride from 'react-joyride';

import tour from './tour';
import Welcome from './Welcome';

const BEEN_HERE_TOKEN = 'p6o-been-here';

export const isFirstTimeVisitor =
  !localStorage.getItem(BEEN_HERE_TOKEN);

const Tutorial = props => {

  const [ showTour, setShowTour ] = useState(false);

  useEffect(() => {
    if (isFirstTimeVisitor)
      localStorage.setItem(BEEN_HERE_TOKEN, true);
  }, []);

  return (
    <>
      {showTour ? 
        <Joyride steps={tour} /> :
        <Welcome onTakeTour={() => setShowTour(true)} />
      }
    </>
  )

}

export default Tutorial;