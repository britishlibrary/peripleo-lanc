import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VscListUnordered } from 'react-icons/vsc';
import { RiFilter2Line } from 'react-icons/ri';
import { useDebounce } from 'use-debounce';
import { useRecoilState } from 'recoil';

import useSearch from '../../state/search/useSearch';
import { categoryFacetState } from '../../state';

import Facets from './Facets';

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
    opacity: 1, 
    height: 40
  },
  hidden: { 
    opacity: 0,
    height: 0
  }
};

const SearchPanel = props => {

  const el = useRef();

  const [ query, setQuery ] = useState('');
  const [ debouncedQuery ] = useDebounce(query, 250);

  const { search, setSearch, fitMap } = useSearch();

  const [ facet, setFacet ] = useRecoilState(categoryFacetState);

  useEffect(() => {
    setSearch(debouncedQuery, search.filters);
  }, [debouncedQuery]);

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

  const onToggleFacetsList = () => {
    if (facet)
      setFacet(null);
    else
      setFacet(search.facets[0]);
  }

  const onChangeFacet = inc => () => {
    const { length } = search.facets;
    const currentIdx = search.facets.indexOf(facet);
    const updatedIdx = (currentIdx + inc + length) % length; 
    setFacet(search.facets[updatedIdx]);
  }

  const onToggleFilter = filter => {
    console.log('toggling filter', filter);
  }

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
        
        <div className="p6o-hud-searchtoolbar-wrapper">
          <h2 
            className="p6o-hud-searchtoolbar-resultcount"
            aria-live="polite">
            {search.total.toLocaleString('en')} Result{search.total !== 1 && 's'}
          </h2>
          
          <button 
            className="p6o-hud-searchtoolbar-btn p6o-hud-searchtoolbar-btn-list"
            tabIndex={2}
            aria-label="List search results">
            <VscListUnordered />
          </button>

          <button 
            className="p6o-hud-searchtoolbar-btn p6o-hud-searchtoolbar-btn-dig"
            tabIndex={3}
            aria-label="Filter your search"
            onClick={onToggleFacetsList}>
            <RiFilter2Line />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {facet && 
          <Facets 
            search={search} 
            facet={facet} 
            onNextFacet={onChangeFacet(1)}
            onPreviousFacet={onChangeFacet(-1)}
            onToggleFilter={onToggleFilter} /> 
        }
      </AnimatePresence>
    </motion.div>
  )

}

export default SearchPanel;