import React from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const Zoom = props => {

  return (
    <div className="p6o-zoom">
      {props.fullscreenButton && <button 
          className="p6o-zoom-btn p6o-hud-button p6o-go-fullscreen"
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
        className="p6o-zoom-btn p6o-hud-button p6o-zoom-in"
        tabIndex={31}
        aria-label="Zoom in"
        onClick={props.onZoomIn}>
        <AiOutlinePlus />
      </button>

      <button 
        className="p6o-zoom-btn p6o-hud-button p6o-zoom-out"
        tabIndex={32}
        aria-label="Zoom out"
        onClick={props.onZoomOut}>
        <AiOutlineMinus />
      </button>
    </div>
  )

}

export default Zoom;