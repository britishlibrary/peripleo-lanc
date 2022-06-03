import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import useSearch from '../../state/search/useSearch';

import Facets from './Facets';
import Filters from './Filters';
import Autosuggest from './Autosuggest';

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
    setFilters,
    toggleFilter,
    clearFilter, 
    setCategoryFacet,
    availableFacets
  } = useSearch();

  const onEnter = () =>
    fitMap();

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

  const onSetFilters = values =>    
    setFilters(search.facet, values);

  return (
    <motion.div 
      ref={el}
      className="p6o-hud-searchpanel"
      variants={parentAnimation}
      transition={{ type: 'spring', duration: 0.4 }}
      initial="hidden"
      animate="visible"
      exit="hidden">

      <Autosuggest 
        search={search}
        onChange={changeSearchQuery} 
        onEnter={onEnter} />

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
              className={search.total > 0 ? 'p6o-hud-searchtoolbar-resultcount' : 'p6o-hud-searchtoolbar-resultcount none'} 
              aria-live="polite">
              {search.total > 0 ?
                <>
                  {search.total.toLocaleString('en')} Result{search.total !== 1 && 's'}
                </> :
                <>
                  No results found for this search
                </>
              }
            </h2>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {search.facet && 
          <Facets 
            arrows={availableFacets.length > 1}
            search={search} 
            onNextFacet={onChangeFacet(1)}
            onPreviousFacet={onChangeFacet(-1)}
            onSetFilters={onSetFilters}
            onToggleFilter={onToggleFilter} 
            onClearFilter={onClearFilter} /> 
        }
      </AnimatePresence>
    </motion.div>
  )

}

export default SearchPanel;