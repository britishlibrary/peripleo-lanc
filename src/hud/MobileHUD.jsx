import React, { useEffect, useState } from 'react';
import { ImFilter } from 'react-icons/im';
import { IoTriangle } from 'react-icons/io5';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useDebounce } from 'use-debounce';
import { AnimatePresence, motion } from 'framer-motion';

import useSearch from '../state/search/useSearch';

import MobileFacets from './search/MobileFacets';

const animation = {
  closed: { 
    maxHeight: 0 
  },
  open: { 
    maxHeight: 50
  }
}

const MobileHUD = props => {

  const [ filtersOpen, setFiltersOpen] = useState(false);

  const { 
    search,
    availableFacets,
    changeSearchQuery,
    fitMap,
    setCategoryFacet
  } = useSearch();

  const [ query, setQuery ] = useState(search?.query || '');
  const [ debouncedQuery ] = useDebounce(query, 250);

  // Shorthand
  const arrows = availableFacets.length > 1;

  useEffect(() => {
    changeSearchQuery(debouncedQuery);
  }, [ debouncedQuery ]);

  useEffect(() => {
    if (filtersOpen) {
      document.querySelector('.p6o-map-container').classList.add('filters-open');
    } else {
      document.querySelector('.p6o-map-container').classList.remove('filters-open');
    }
  }, [filtersOpen]);

  useEffect(() => {
    if (search?.facet && !filtersOpen)
      setFiltersOpen(true);
  }, [ search?.facet ]);

  const onChange = evt =>
    setQuery(evt.target.value);

  const onKeyDown = evt => { 
    const keycode = evt.keyCode || evt.which;
    if (keycode === 13)
     fitMap();
  }

  const onShowFacets = () => {
    if (filtersOpen) {
      setFiltersOpen(false);
      setCategoryFacet(null);
    } else {
      setFiltersOpen(true);
      setCategoryFacet(availableFacets[0]);
    }
  }

  const onChangeFacet = inc => () => {
    const { length } = availableFacets;
    const currentIdx = availableFacets.indexOf(search.facet);
    const updatedIdx = (currentIdx + inc + length) % length; 
    setCategoryFacet(availableFacets[updatedIdx]);
  }

  return (
    <div className="p6o-mobile-hud">
      <div className="p6o-mobile-hud-top">
        <button 
          className="p6o-mobile-hud-filter-toggle"
          onClick={onShowFacets}>
          <ImFilter className="p6o-mobile-hud-filter-toggle-icon" />
          <IoTriangle className="p6o-mobile-hud-filter-toggle-arrow" />
        </button>

        <div className="p6o-mobile-hud-searchinput">
          <input 
            placeholder="Enter your search"
            aria-label="Enter search"
            value={query} 
            onKeyDown={onKeyDown}
            onChange={onChange} />
        </div>
      </div> 

      <AnimatePresence>
        {filtersOpen &&
          <>
            <motion.div className="p6o-mobile-hud-bottom"
              variants={animation}
              initial="closed"
              animate="open"
              exit="closed">

              {arrows &&
                <button 
                  tabIndex={4}
                  aria-label="Previous filter category"
                  onClick={onChangeFacet(-1)}>
                  <HiOutlineChevronLeft />
                </button>
              }
            
              <h3 
                aria-live="polite"
                aria-atomic={true}>
                {search.facet.replace('_', ' ')}
              </h3>
            
              {arrows &&
                <button
                  tabIndex={5}
                  aria-label="Next filter category" 
                  onClick={onChangeFacet(+1)}>
                  <HiOutlineChevronRight />
                </button>
              }
            </motion.div>

            <MobileFacets search={search} />
          </>
        }
      </AnimatePresence>
    </div>
  )

}

export default MobileHUD;