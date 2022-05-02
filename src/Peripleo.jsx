import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import useSearch from './state/search/useSearch'

import HUD from './hud/HUD';
import MobileHUD from './hud/MobileHUD';
import Map from './map/Map';
import { deviceState } from './state';

/**
 * Test if Peripleo is running in an <iframe>
 */
 const isIFrame = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const Peripleo = props => {

  const el = useRef();

  const device = useRecoilValue(deviceState);

  const [ isFullscreen, setIsFullscreen ] = useState(false);

  const { refreshSearch } = useSearch();

  useEffect(() => {
    if (el.current)
      el.current.classList.add('loading');
  }, [el.current]);

  useEffect(() => {
    refreshSearch();
  }, [props.dataAvailable]);

  useEffect(() => {
    el.current.classList.remove('loading');
  }, [props.loaded]);

  const toggleFullScreen = () => {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      const element = document.documentElement;
      if (element.requestFullScreen) {
        element.requestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.msRequestFullScreen) {
        element.msRequestFullScreen();
      }
    }

    setIsFullscreen(!isFullscreen);
  }

  return (
    <Map 
      ref={el}
      config={props.config} 
      isIFrame={isIFrame}
      isFullscreen={isFullscreen}
      onToggleFullscreen={toggleFullScreen}
      onLoad={props.onMapLoaded}>
      
      {device === 'MOBILE' ? 
        <MobileHUD 
          config={props.config} /> :

        <HUD 
          config={props.config} />
      }
    </Map>
  )

}

export default Peripleo;