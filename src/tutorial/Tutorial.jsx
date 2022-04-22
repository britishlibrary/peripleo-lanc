import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useSetRecoilState } from 'recoil';

import tour from './tour';
import Welcome from './Welcome';
import useSearch from '../state/search/useSearch';
import { mapModeState, hudOpenState } from '../state';

export const BEEN_HERE_TOKEN = 'p6o-been-here';

export const isFirstTimeVisitor =
  !localStorage.getItem(BEEN_HERE_TOKEN);

const Tutorial = props => {

  const { 
    search, 
    availableFacets,
    setCategoryFacet 
  } = useSearch();

  const setMapMode = useSetRecoilState(mapModeState);  

  const setIsHudOpen = useSetRecoilState(hudOpenState);

  const [ showWelcome, setShowWelcome ] = useState(true);

  const [ showTour, setShowTour ] = useState(false);

  const [ isRunning, setIsRunning ] = useState(true);

  const [ currentStep, setCurrentStep ] = useState(0);

  useEffect(() => {
    if (!isRunning) 
      setTimeout(() => setIsRunning(true), 2000);
  }, [ isRunning ]);

  const onStartTour = () => {
    // Initial state
    setCategoryFacet();
    setIsHudOpen(false);
    setMapMode('points');
    
    setShowWelcome(false);
    setShowTour(true);
  }

  const onEndTour = () => {
    // Need to set our running state to false, so we can restart if we click start again.
    setCategoryFacet();
    setIsHudOpen(false);
    setIsRunning(false);
  }

  const onTourCallback = data => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStep = index + (action === ACTIONS.PREV ? -1 : 1);

      if (nextStep === 1 && !search.facet) {
        setTimeout(() => setCategoryFacet(availableFacets[0]), 200);
        setCurrentStep(nextStep);
      } else {
        setCurrentStep(nextStep);
      }

    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      onEndTour();
    }
  }

  return (
    <>
      {showWelcome && 
        <Welcome
          onNoThanks={() => setShowWelcome(false)} 
          onTakeTour={onStartTour} />
      }

      {showTour &&
        <Joyride 
          continuous
          showProgress
          hideCloseButton
          disableScrollParentFix
          disableScrolling
          run={isRunning}
          steps={tour}
          stepIndex={currentStep}
          callback={onTourCallback}/>
      }
    </>
  )

}

export default Tutorial;