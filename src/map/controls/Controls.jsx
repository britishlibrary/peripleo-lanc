import React, { useRef, useState } from 'react';
import { FiMap } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { 
  AiOutlineFullscreen, 
  AiOutlineFullscreenExit, 
  AiOutlinePlus, 
  AiOutlineMinus 
} from 'react-icons/ai';

import useClickOutside from '../../useClickoutside';
import MapModesDropdown from './MapModesDropdown';
import { deviceState } from '../../state';

const Zoom = props => {

  const device = useRecoilValue(deviceState);

  const [ isModesMenuVisible, setIsModesMenuVisible ] = useState(false);

  const el = useRef();

  useClickOutside(el, () => setIsModesMenuVisible(false));

  return (
    <div
      ref={el} 
      className={device === 'MOBILE' ? 'p6o-controls mobile' : 'p6o-controls'}>
      {props.fullscreenButton && <button 
          className="p6o-controls-btn p6o-hud-button p6o-toggle-fullscreen"
          aria-label="Switch to fullscreen"
          tabIndex={30}
          onClick={props.onToggleFullscreen}>
          {props.isFullscreen ? 
            <AiOutlineFullscreenExit /> :
            <AiOutlineFullscreen />
          }
        </button>
      }
      
      <button 
        className="p6o-controls-btn p6o-hud-button p6o-zoom-in"
        tabIndex={31}
        aria-label="Zoom in"
        onClick={props.onZoomIn}>
        <AiOutlinePlus />
      </button>

      <button 
        className="p6o-controls-btn p6o-hud-button p6o-zoom-out"
        tabIndex={32}
        aria-label="Zoom out"
        onClick={props.onZoomOut}>
        <AiOutlineMinus />
      </button>

      <div className="p6o-map-modes">
        <button
          className="p6o-controls-btn p6o-hud-button"
          tabIndex={33}
          aria-label="Mapping modes"
          onClick={() => setIsModesMenuVisible(!isModesMenuVisible) }>
          <FiMap />
        </button>

        <AnimatePresence>
          {isModesMenuVisible &&
            <MapModesDropdown />
          }
        </AnimatePresence>
      </div>
    </div>
  )

}

export default Zoom;