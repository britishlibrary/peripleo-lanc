import React, { useCallback, useContext, useEffect, useState } from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import WebMercatorViewport from '@math.gl/web-mercator';
import { useDebounce } from 'use-debounce';

import { StoreContext } from '../store';
import { pointStyle } from './Styles';

import Hover from './components/Hover';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const Map = props => {

  const { store } = useContext(StoreContext);

  const { config } = props;

  const [ viewState, setViewState ] = useState();

  const [ debouncedViewState ] = useDebounce(viewState, 500);

  const [ searchResults, setSearchResults ] = useState(toFeatureCollection());

  const [ hover, setHover ] = useState();

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

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

  const onMove = useCallback(evt =>
    setViewState(evt.viewState), []);

  const onMouseMove = useCallback(evt => {
    const { features, point } = evt;
    const { id } = features[0].properties;
    
    const updated = id === hover?.id ? {
      ...hover, ...point
    } : { 
      node: store.getNode(id),
      ...point
    };

    setHover(updated);
  }, []);

  const onMouseLeave = () => setHover(null);

  return (  
    <div className="p6o-map-container">
      <ReactMapGL
        initialViewState={{
          bounds: config.initial_bounds
        }}
        mapStyle={style}
        interactiveLayerIds={['search-results']}
        onMove={onMove}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}>

        <Source type="geojson" data={searchResults}>
          <Layer 
            id="search-results"
            {...pointStyle({ fill: 'red', radius: 5 })} />
        </Source>

      </ReactMapGL>

      {hover && <Hover {...hover} />}
    </div>
  )

}

export default Map;