import React from 'react';
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { mapModeState } from '../../state';

const Mode = props => {

  return (
    <li 
      className={props.selected ? "p6o-map-mode-variant" : "p6o-map-mode-variant selected" }
      onClick={() => props.onSelect(props.label)}>
      {props.label} {props.selected ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }
    </li>
  )

}

const MapModesDropdown = () => {

  const [ mapMode, setMapMode ] = useRecoilState(mapModeState);  

  return (
    <div className="p6o-map-modes-dropdown">
      <h1>Display map data as:</h1>
      <ul>
        {['points', 'clusters', 'heatmap'].map(label =>
          <Mode
            key={label}
            selected={label === mapMode}
            label={label} 
            onSelect={setMapMode} />
        )}
      </ul>
    </div>
  )

}

export default MapModesDropdown;