import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BiSearchAlt2 } from 'react-icons/bi';

import useSearch from '../state/search/useSearch';
import SearchPanel from './search/SearchPanel';

const HUD = props => {
  
  const { search } = useSearch();

  // HUD open by default, if there's a facet
  const [ isHudOpen, setIsHudOpen ] = useState(!!search?.facet);

  useEffect(() => {
    if (search?.facet && !isHudOpen)
      setIsHudOpen(true);
  }, [ search?.facet ]);

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
            key="search-panel" />
        }
      </AnimatePresence>
    </div>
  )

}

export default HUD;