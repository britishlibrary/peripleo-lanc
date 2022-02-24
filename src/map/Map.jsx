import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import WebMercatorViewport from '@math.gl/web-mercator';
import { useDebounce } from 'use-debounce';

import { StoreContext } from '../store';

import Zoom from './components/Zoom';
import Hover from './components/Hover';
import SelectionPreview from './components/SelectionPreview';

import { partitionBy } from './Layers';

import { pointStyle } from './styles/point';
import { clusterPointStyle, clusterLabelStyle } from './styles/cluster';
import { heatmapCoverageStyle, heatmapPointStyle } from './styles/heatmap';
import { colorHeatmapCoverage, colorHeatmapPoint } from './styles/colorHeatmap';

/** 
 * TODO temporary - for user testing
 */
import VariantsRadioButton from '../usertesting/VariantsRadioButton';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const Map = React.forwardRef((props, ref) => {

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { config } = props;

  const [ viewState, setViewState ] = useState();

  const [ debouncedViewState ] = useDebounce(viewState, 500);

  const [ layers, setLayers ] = useState([]);

  const [ hover, setHover ] = useState();

  const [ selection, setSelection ] = useState();

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

  const [ selectedMode, setSelectedMode ] = useState('POINTS');

  useEffect(() => {
    // Feed the current viewport state upstream 
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      ...debouncedViewState
    };

    const bounds = new WebMercatorViewport(viewport).getBounds();
    props.onChangeViewport && props.onChangeViewport(bounds);
  }, [ debouncedViewState ]);

  useEffect(() => {
    // Map container gets hover element, 
    // so we can toggle cursor
    if (hover)
      ref.current.classList.add('hover');
    else
      ref.current.classList.remove('hover');
  }, [ hover ]);

  const onMapChange = useCallback(evt =>
    setViewState(evt.viewState), []);

  const onMouseMove = useCallback(evt => {
    const { point } = evt;

    const features = mapRef.current
      .queryRenderedFeatures(evt.point)
      .filter(f => f.layer.id.startsWith('p6o'));

    if (features.length > 0) {
      const { id } = features[0].properties;

      const updated = id === hover?.id ? {
        ...hover, ...point
      } : { 
        node: store.getNode(id),
        ...point
      };
  
      setHover(updated);
    } else {
      setHover(null);
    }
  }, []);

  const onClick = () => {
    if (hover) {
      const { node } = hover;
      history.pushState(node, node.title, `#/${encodeURIComponent(node.id)}`);
      
      setSelection(node);
    } else {
      setSelection(null);
    }
  }
  
  /** 
   * TODO temporary - for user testing
   */
  useEffect(() => {
    if (props.searchResults) {
      setLayers(partitionBy(props.searchResults, 'dataset'));
    }
  }, [props.searchResults])



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
        onLoad={props.onLoad}
        onMove={onMapChange}
        onClick={onClick}
        onMouseMove={onMouseMove}>

        {selectedMode === 'POINTS' &&
          <Source type="geojson" data={toFeatureCollection(props.searchResults)}>
            <Layer 
              id="p6o-points"
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
              id="p6o-points"
              filter={['!', ['has', 'point_count']]}
              {...pointStyle({ fill: 'red', radius: 5 })} />
          </Source>
        }

        {selectedMode === 'HEATMAP' &&
          <Source type="geojson" data={toFeatureCollection(props.searchResults)}>
            <Layer
              id="p6o-heatmap"
              {...heatmapCoverageStyle()} />
          
            <Layer
              id="p6o-points"
              {...heatmapPointStyle()} /> 
          </Source>
        }

        {selectedMode === 'COLOURED_HEATMAP' &&
          Object.entries(layers).map(([layer, features], idx) =>
            <Source key={layer} type="geojson" data={toFeatureCollection(features)}>
              <Layer
                id={`p6o-heatmap-${layer}`}
                {...colorHeatmapCoverage(idx)} />
            
              <Layer
                id={`p6o-points-${layer}`}
                {...colorHeatmapPoint(idx)} /> 
            </Source>
          )
        }

        {selection && 
          <SelectionPreview 
            config={props.config}
            selection={selection} />
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