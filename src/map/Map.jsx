import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
// import WebMercatorViewport from '@math.gl/web-mercator';
// import { useDebounce } from 'use-debounce';

import { StoreContext } from '../store';

import { pointStyle } from './styles/point';
import { clusterPointStyle, clusterLabelStyle } from './styles/cluster';
import { heatmapCoverageStyle, heatmapPointStyle } from './styles/heatmap';
import { colorHeatmapCoverage, colorHeatmapPoint } from './styles/colorHeatmap';

import Zoom from './components/Zoom';
import Hover from './components/Hover';
import { partitionBy } from './Layers';

import VariantsRadioButton from '../usertesting/VariantsRadioButton';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const Map = React.forwardRef((props, ref) => {

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { config } = props;

  // const [ viewState, setViewState ] = useState();

  // const [ debouncedViewState ] = useDebounce(viewState, 500);

  const [ layers, setLayers ] = useState([]);

  const [ hover, setHover ] = useState();

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

  const [ selectedMode, setSelectedMode ] = useState('POINTS');

  /*
  useEffect(() => {
    // TODO we'll need this handler later!
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      ...debouncedViewState
    };

    const bounds = new WebMercatorViewport(viewport).getBounds();
    const nodes = store.getNodesInBounds(bounds);
    setSearchResults(toFeatureCollection(nodes));
  }, [ debouncedViewState ]);
  */

  // Hack, for testing
  useEffect(() => {
    if (props.searchResults) {
      setLayers(partitionBy(props.searchResults, 'dataset'));
    }
  }, [props.searchResults])

  useEffect(() => {
    if (hover)
      ref.current.classList.add('hover');
    else
      ref.current.classList.remove('hover');
  }, [ hover ]);

  const onClick = () => {
    if (hover) {
      const { node } = hover;
      console.log('clicked', hover); // TODO
      history.pushState(node, node.title, `#/${encodeURIComponent(node.id)}`);
    }
  }

  //const onMove = useCallback(evt =>
  //  setViewState(evt.viewState), []);

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

  const onMouseLeave = () => 
    setHover(null);

  const onZoom = inc => () => {
    const map = mapRef.current;
    const z = mapRef.current.getZoom();
    map.easeTo({ zoom: z + inc });
  }

  return (  
    <div className="p6o-map-container" ref={ref}>
      <ReactMapGL
        ref={mapRef}
        initialViewState={{
          bounds: config.initial_bounds
        }}
        mapStyle={style}
        // interactiveLayerIds={['search-results']}
        onLoad={props.onLoad}
        // onMove={onMove}
        onClick={onClick}
        // onMouseMove={onMouseMove}
        // onMouseLeave={onMouseLeave} >
        >

        {selectedMode === 'POINTS' &&
          <Source type="geojson" data={toFeatureCollection(props.searchResults)}>
            <Layer 
              id="search-results"
              {...pointStyle({ fill: 'red', radius: 5 })} />
          </Source>
        }

        {selectedMode === 'CLUSTERS' &&
          <Source 
            type="geojson" 
            cluster={true}
            data={toFeatureCollection(props.searchResults)}>

            <Layer 
              {...clusterPointStyle()} />

            <Layer  
              {...clusterLabelStyle()} />

            <Layer 
              id="search-results"
              filter={['!', ['has', 'point_count']]}
              {...pointStyle({ fill: 'red', radius: 5 })} />
          </Source>
        }

        {selectedMode === 'HEATMAP' &&
          <Source type="geojson" data={toFeatureCollection(props.searchResults)}>
            <Layer
              id="search-results-ht"
              {...heatmapCoverageStyle()} />
          
            <Layer
              id="search-results-pt"
              {...heatmapPointStyle()} /> 
          </Source>
        }

        {selectedMode === 'COLOURED_HEATMAP' &&
          Object.entries(layers).map(([layer, features], idx) =>
            <Source key={layer} type="geojson" data={toFeatureCollection(features)}>
              <Layer
                id={`search-results-ht-${layer}`}
                {...colorHeatmapCoverage(idx)} />
            
              <Layer
                id={`search-results-pt-${layer}`}
                {...colorHeatmapPoint(idx)} /> 
            </Source>
          )
        }
      </ReactMapGL>

      {/* USERTESTING */}
      <VariantsRadioButton 
        selected={selectedMode}
        onSelect={setSelectedMode} />

      <Zoom 
        onZoomIn={onZoom(1)}
        onZoomOut={onZoom(-1)} />

      {props.children}

      {hover && <Hover {...hover} />}
    </div>
  )

});

export default Map;