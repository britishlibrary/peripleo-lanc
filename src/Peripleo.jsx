import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { StoreContext } from './store';
import SearchResults from './SearchResults';

import HUD from './hud/HUD';
import Map from './map/Map';

const Peripleo = props => {

  const el = useRef();

  const { store } = useContext(StoreContext);

  const [ searchQuery, setSearchQuery ] = useState();
  const [ debouncedQuery ] = useDebounce(searchQuery, 250);

  const [ searchResults, setSearchResults ] = useState(new SearchResults());

  const [ currentFacet, setCurrentFacet ] = useState();

  useEffect(() => {
    if (el.current)
      el.current.classList.add('loading');
  }, [el.current]);

  useEffect(() => {
    const results = new SearchResults(store.getAllLocatedNodes());
    setSearchResults(results);
  }, [props.dataAvailable]);

  useEffect(() => {
    el.current.classList.remove('loading');
  }, [props.loaded]);

  useEffect(() => {
    const results = debouncedQuery ?
      store.searchMappable(debouncedQuery) :
      store.getAllLocatedNodes();

    setSearchResults(new SearchResults(results));
  }, [debouncedQuery]);

  const onSelect = selection => {
    // TODO this is currently a single node ONLY
    // but will (or may) be an array of nodes in the future
    setSelection(selection);
  }

  return (
    <>
      <Map 
        ref={el}
        config={props.config} 
        initialViewState={props.initialViewState}
        searchResults={searchResults}
        currentFacet={currentFacet}
        onLoad={props.onMapLoaded}
        onSelect={onSelect}>
        
        <HUD 
          config={props.config}
          searchQuery={searchQuery}
          searchResults={searchResults}
          currentFacet={currentFacet}
          onChangeSearchQuery={setSearchQuery} 
          onChangeFacet={setCurrentFacet} />
      </Map>
    </>
  )

}

export default Peripleo;