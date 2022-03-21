import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useRecoilValue } from 'recoil';

import { categoryFacetState } from '../state';

import SearchPanel from './search/SearchPanel';

const HUD = props => {
  
  const facet = useRecoilValue(categoryFacetState);

  // HUD open by default, if there's a facet
  const [ isHudOpen, setIsHudOpen ] = useState(!!facet);

  const onToggleHUD = () =>
    setIsHudOpen(!isHudOpen);

  return (
    <div className="p6o-hud">
      <button 
        className="p6o-magic-button p6o-hud-button"
        tabIndex={1}
        aria-label="Search"
        onClick={onToggleHUD}>
        <BiSearchAlt2 />
      </button>

      <AnimatePresence>
        {isHudOpen &&
          <SearchPanel 
            key="search-panel"
            query={props.searchQuery}
            results={props.searchResults}
            facet={props.currentFacet}
            onChange={props.onChangeSearchQuery} />
        }
      </AnimatePresence>
    </div>
  )

}

export default HUD;