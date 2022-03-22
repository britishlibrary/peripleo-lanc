import React, { useEffect, useRef } from 'react';

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

const goFullScreen = () => {
  const element = document.documentElement;

  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

const Peripleo = props => {

  const el = useRef();

  const { setSearch } = useSearch();

  useEffect(() => {
    if (el.current)
      el.current.classList.add('loading');
  }, [el.current]);

  useEffect(() => {
    // Reset search after data available
    setSearch();
  }, [props.dataAvailable]);

  useEffect(() => {
    el.current.classList.remove('loading');
  }, [props.loaded]);

  return (
    <>
      <Map 
        ref={el}
        config={props.config} 
        isIFrame={isIFrame}
        onGoFullscreen={goFullScreen}
        onLoad={props.onMapLoaded}>
        
        <HUD 
          config={props.config} />
      </Map>
    </>
  )

}

export default Peripleo;