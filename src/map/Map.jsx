import React, { useContext, useEffect, useState } from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import WebMercatorViewport from '@math.gl/web-mercator';
import { useDebounce } from 'use-debounce';

import { StoreContext } from '../store';
import { pointStyle } from './Styles';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const Map = props => {

  const { store } = useContext(StoreContext);

  const { config } = props;

  const [ viewState, setViewState ] = useState();

  const [ debouncedViewState ] = useDebounce(viewState, 500);

  const [ searchResults, setSearchResults ] = useState(toFeatureCollection());

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

  const onMove = evt =>
    setViewState(evt.viewState);

  // For testing: start with all data
  useEffect(() => {
    setSearchResults(toFeatureCollection(store.getNodesInBounds(config.initial_bounds)));
  }, [ props.loaded ]);

  useEffect(() => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      ...debouncedViewState
    };

    const bounds = new WebMercatorViewport(viewport).getBounds();
    const nodes = store.getNodesInBounds(bounds);
    setSearchResults(toFeatureCollection(nodes));
  }, [ debouncedViewState ]);

  return (  
    <div className="p6o-map-container">
      <ReactMapGL
        initialViewState={{
          bounds: config.initial_bounds
        }}
        height="100vh"
        mapStyle={style}
        onMove={onMove}>

        <Source id="search-results" type="geojson" data={searchResults}>
          <Layer 
            {...pointStyle({ fill: 'red', radius: 5 })} />
        </Source>

      </ReactMapGL>
    </div>
  )

}

export default Map;