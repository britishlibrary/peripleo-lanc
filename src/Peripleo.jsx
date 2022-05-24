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

const FULLSCREEN_STYLE = {
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  border: 'none',
  zIndex: 99999
};

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
    // iframe container
    const { frameElement } = window;

    if (isFullscreen) {
      Object.entries(FULLSCREEN_STYLE).forEach(([key, _]) =>
        frameElement.style[key] = null);
    } else {
      Object.entries(FULLSCREEN_STYLE).forEach(([key, value]) =>
        frameElement.style[key] = value);
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