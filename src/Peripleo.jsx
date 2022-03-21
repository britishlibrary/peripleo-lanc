import React, { useContext, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { StoreContext } from './store';
import { categoryFacetState, searchResultState } from './state';
import SearchResults from './SearchResults';

import HUD from './hud/HUD';
import Map from './map/Map';

const goFullScreen = () => {
  const element = document.documentElement;

  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

const Peripleo = props => {

  const el = useRef();

  const { store } = useContext(StoreContext);

  const [ searchResults, setSearchResults ] = useRecoilState(searchResultState);

  const currentFacet = useRecoilValue(categoryFacetState);

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

  const onSelect = selection => {
    // TODO this is currently a single node ONLY
    // but will (or may) be an array of nodes in the future
    setSelection(selection);
  }

  const onSearchEnter = () => {
    const r = searchResults.clone();
    r.fitMap = true;
    setSearchResults(r);
  }

  return (
    <>
      <Map 
        ref={el}
        config={props.config} 
        isIFrame={props.isIFrame}
        searchResults={searchResults}
        currentFacet={currentFacet}
        onGoFullscreen={goFullScreen}
        onLoad={props.onMapLoaded}
        onSelect={onSelect}>
        
        <HUD 
          config={props.config}
          onSearchEnter={onSearchEnter} />
      </Map>
    </>
  )

}

export default Peripleo;