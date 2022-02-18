import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BiSearchAlt2 } from 'react-icons/bi';

import SearchPanel from './components/SearchPanel';

const HUD = props => {

  const [ isHudOpen, setIsHudOpen ] = useState();

  const onToggleHUD = () =>
    setIsHudOpen(!isHudOpen);

  return (
    <div className="p6o-hud">
      <div 
        className="p6o-magic-button p6o-hud-button"
        onClick={onToggleHUD}>
        <BiSearchAlt2 />
      </div>

      <AnimatePresence>
        {isHudOpen &&
          <SearchPanel 
            query={props.searchQuery}
            onChange={props.onChangeSearchQuery} />
        }
      </AnimatePresence>
    </div>
  )

}

export default HUD;