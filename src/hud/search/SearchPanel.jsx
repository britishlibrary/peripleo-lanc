import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VscListUnordered } from 'react-icons/vsc';
import { RiFilter2Line } from 'react-icons/ri';
import { useDebounce } from 'use-debounce';

import useSearch from '../../state/search/useSearch';

import Facets from './Facets';
import Filters from './Filters';

const parentAnimation = {
  visible: { 
    opacity: 1, 
    width: 380
  },
  hidden: { 
    opacity: 0,
    width: 0
  }
};

const childAnimation = {
  visible: { 
    opacity: 1
  },
  hidden: { 
    opacity: 0
  }
};

const SearchPanel = props => {

  const el = useRef();

  const { 
    search, 
    changeSearchQuery, 
    fitMap, 
    toggleFilter,
    clearFilter, 
    setCategoryFacet,
    availableFacets
  } = useSearch();

  const [ query, setQuery ] = useState(search?.query || '');
  const [ debouncedQuery ] = useDebounce(query, 250);

  useEffect(() => {
    changeSearchQuery(debouncedQuery);
  }, [ debouncedQuery ]);

  useEffect(() => {
    if (el.current)
      el.current.querySelector('input').focus();
  }, [ el.current ]);

  const onChange = evt =>
    setQuery(evt.target.value);

  const onKeyDown = evt => { 
    if (evt.code === 'Enter')
      fitMap();
  }

  const onChangeFacet = inc => () => {
    const { length } = availableFacets;
    const currentIdx = availableFacets.indexOf(search.facet);
    const updatedIdx = (currentIdx + inc + length) % length; 
    setCategoryFacet(availableFacets[updatedIdx]);
  }

  const onToggleFilter = value =>
    toggleFilter(search.facet, value);

  const onClearFilter = () => 
    clearFilter(search.facet);

  return (
    <motion.div 
      ref={el}
      className="p6o-hud-searchpanel"
      variants={parentAnimation}
      transition={{ type: 'spring', duration: 0.4 }}
      initial="hidden"
      animate="visible"
      exit="hidden">

      <div className="p6o-hud-searchinput">
        <input 
          tabIndex={2}
          placeholder="Enter your search"
          aria-label="Enter search"
          value={query} 
          onKeyDown={onKeyDown}
          onChange={onChange} />
      </div>

      <motion.div
        className="p6o-hud-searchtoolbar"
        variants={childAnimation}
        initial="hidden"
        animate="visible"
        exit="hidden">

        <div className="p6o-hud-searchtoolbar-body">
          <Filters />
          
          <div className="p6o-hud-searchtoolbar-footer">
            <h2 
              className="p6o-hud-searchtoolbar-resultcount"
              aria-live="polite">
              {search.total.toLocaleString('en')} Result{search.total !== 1 && 's'}
            </h2>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {search.facet && 
          <Facets 
            search={search} 
            onNextFacet={onChangeFacet(1)}
            onPreviousFacet={onChangeFacet(-1)}
            onToggleFilter={onToggleFilter} 
            onClearFilter={onClearFilter} /> 
        }
      </AnimatePresence>
    </motion.div>
  )

}

export default SearchPanel;