import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BiSearchAlt2 } from 'react-icons/bi';

import SearchPanel from './search/SearchPanel';

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
            key="search-panel"
            query={props.searchQuery}
            results={props.searchResults}
            facet={props.currentFacet}
            onChange={props.onChangeSearchQuery} 
            onChangeFacet={props.onChangeFacet} />
        }
      </AnimatePresence>
    </div>
  )

}

export default HUD;