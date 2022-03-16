import React from 'react';
import { AiOutlineFullscreen, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const Zoom = props => {

  return (
    <div className="p6o-zoom">
      {props.fullscreenButton && <div 
          className="p6o-zoom-btn p6o-hud-button p6o-go-fullscreen"
          onClick={props.onGoFullscreen}>
          <AiOutlineFullscreen />
        </div>
      }
      
      <div 
        className="p6o-zoom-btn p6o-hud-button p6o-zoom-in"
        onClick={props.onZoomIn}>
        <AiOutlinePlus />
      </div>

      <div 
        className="p6o-zoom-btn p6o-hud-button p6o-zoom-out"
        onClick={props.onZoomOut}>
        <AiOutlineMinus />
      </div>
    </div>
  )

}

export default Zoom;