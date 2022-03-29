import React, { useState } from 'react';
import { RiMapLine } from 'react-icons/ri';
import { 
  AiOutlineFullscreen, 
  AiOutlineFullscreenExit, 
  AiOutlinePlus, 
  AiOutlineMinus 
} from 'react-icons/ai';

import MapModesDropdown from './MapModesDropdown';

const Zoom = props => {

  const [ isModesMenuVisible, setIsModesMenuVisible ] = useState(false);

  return (
    <div className="p6o-controls">
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

      <button
        className="p6o-controls-btn p6o-hud-button p6o-map-modes"
        tabIndex={33}
        aria-label="Mapping modes"
        onClick={() => setIsModesMenuVisible(!isModesMenuVisible) }>
        <RiMapLine />
      </button>

      {isModesMenuVisible &&
        <MapModesDropdown />
      }
    </div>
  )

}

export default Zoom;