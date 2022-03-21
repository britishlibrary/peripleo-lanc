import React, { useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VscListUnordered } from 'react-icons/vsc';
import { RiFilter2Line } from 'react-icons/ri';
import { useDebounce } from 'use-debounce';
import { useRecoilState } from 'recoil';

import SearchResults from '../../SearchResults';
import { StoreContext } from '../../store';
import { categoryFacetState, searchResultState } from '../../state';

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

  const { store } = useContext(StoreContext);

  const [ query, setQuery ] = useState('');
  const [ debouncedQuery ] = useDebounce(query, 250);

  const [ searchResults, setSearchResults ] = useRecoilState(searchResultState)

  const [ facet, setFacet ] = useRecoilState(categoryFacetState);

  useEffect(() => {
    const results = debouncedQuery ?
      store.searchMappable(debouncedQuery) :
      store.getAllLocatedNodes();

    setSearchResults(new SearchResults(results));
  }, [debouncedQuery]);

  useEffect(() => {
    if (el.current)
      el.current.querySelector('input').focus();
  }, [ el.current ]);

  const onChange = evt =>
    setQuery(evt.target.value);

  const onKeyDown = evt => {
    if (evt.code === 'Enter')
      props.onEnter();
  }

  const onToggleFacet = () => {
    if (facet)
      setFacet(null);
    else
      setFacet(searchResults.facets[0]);
  }

  const onChangeFacet = inc => () => {
    const { length } = searchResults.facets;
    const currentIdx = searchResults.facets.indexOf(facet);
    const updatedIdx = (currentIdx + inc + length) % length; 
    setFacet(searchResults.facets[updatedIdx]);
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
            {searchResults.total.toLocaleString('en')} Result{searchResults.length !== 1 && 's'}
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
            onClick={onToggleFacet}>
            <RiFilter2Line />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {facet && 
          <Facets 
            results={searchResults} 
            facet={facet} 
            onNextFacet={onChangeFacet(1)}
            onPreviousFacet={onChangeFacet(-1)}
            onToggleFilter={props.onToggleFilter} /> 
        }
      </AnimatePresence>
    </motion.div>
  )

}

export default SearchPanel;