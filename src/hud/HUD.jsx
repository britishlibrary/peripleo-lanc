import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BiSearchAlt2 } from 'react-icons/bi';
import { ImFilter } from 'react-icons/im';

import useSearch from '../state/search/useSearch';
import SearchPanel from './search/SearchPanel';

const HUD = props => {
  
  const { search, setCategoryFacet, availableFacets } = useSearch();

  // HUD open by default, if there's a facet
  const [ isHudOpen, setIsHudOpen ] = useState(!!search?.facet);

  useEffect(() => {
    if (search?.facet && !isHudOpen)
      setIsHudOpen(true);
  }, [ search?.facet ]);

  const onToggleHUD = () => {
    // Clear facet when the HUD closes!
    if (search?.facet)
      setCategoryFacet(null);

    setIsHudOpen(!isHudOpen);
  }

  const onToggleFacetsList = () => {
    if (search.facet)
      setCategoryFacet(null);
    else
      setCategoryFacet(availableFacets[0]);
  }


  return (
    <div className="p6o-hud">
      <button 
        className="p6o-search-button"
        tabIndex={1}
        aria-label="Search"
        onClick={onToggleHUD}>
        <BiSearchAlt2 />
      </button>

      <button
        className="p6o-filters-button"
        tabIndex={2}
        aria-label="Filters"
        onClick={onToggleFacetsList}>
        <ImFilter />
        {search.filters.length > 0 &&
          <span className="p6o-filters-badge">{search.filters.length}</span>
        }
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