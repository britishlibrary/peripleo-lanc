import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { StoreContext } from './store';

import HUD from './hud/HUD';
import Map from './map/Map';
import SelectionPreview from './selection/SelectionPreview';

const Peripleo = props => {

  const el = useRef();

  const { store } = useContext(StoreContext);

  const [ viewport, setViewport ] = useState();

  const [ searchQuery, setSearchQuery ] = useState();
  const [ debouncedQuery ] = useDebounce(searchQuery, 250);

  const [ searchResults, setSearchResults ] = useState();

  const [ selection, setSelection ] = useState();

  useEffect(() => {
    if (el.current)
      el.current.classList.add('loading');
  }, [el.current]);

  useEffect(() => {
    setSearchResults(store.getNodesInBounds(props.config.initial_bounds));
  }, [props.dataAvailable]);

  useEffect(() => {
    el.current.classList.remove('loading');
  }, [props.loaded]);

  useEffect(() => {
    if (debouncedQuery)
      setSearchResults(store.searchMappable(debouncedQuery));
    else
      setSearchResults(store.getNodesInBounds(props.config.initial_bounds));
  }, [debouncedQuery]);

  const onSelect = selection => {
    // TODO
    setSelection(selection);
  }

  return (
    <>
      <Map 
        ref={el}
        config={props.config} 
        searchResults={searchResults}
        onLoad={props.onMapLoaded}
        onChangeViewport={setViewport}
        onSelect={onSelect}>
        
        <HUD 
          config={props.config}
          searchQuery={searchQuery}
          searchResults={searchResults}
          onChangeSearchQuery={setSearchQuery} />
      </Map>

      {selection && 
        <SelectionPreview 
          selection={selection} />
      }
    </>
  )

}

export default Peripleo;