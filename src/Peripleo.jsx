import React, { useEffect, useRef, useState } from 'react';

import useSearch from './state/search/useSearch'

import HUD from './hud/HUD';
import Map from './map/Map';

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
      
      <HUD 
        config={props.config} />
    </Map>
  )

}

export default Peripleo;