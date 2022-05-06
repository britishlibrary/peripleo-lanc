import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, { AttributionControl } from 'react-map-gl';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AnimatePresence } from 'framer-motion';

import useSearch from '../state/search/useSearch';
import { StoreContext } from '../store';
import { mapViewState, mapModeState, deviceState } from '../state';

import { parseLayerConfig } from './BaseLayers';
import LayersCategorized from './LayersCategorized';
import LayersUncategorized from './LayersUncategorized';

import Controls from './controls/Controls';
import HoverBubble from './HoverBubble';
import SelectionPreview from './selection/SelectionPreview';

const Map = React.forwardRef((props, ref) => {

  const { config } = props;

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { search } = useSearch();

  const [ viewstate, setViewstate ] = useRecoilState(mapViewState);

  const modeState = useRecoilValue(mapModeState);

  const device = useRecoilValue(deviceState);

  const [ hover, setHover ] = useState();

  const [ selection, setSelection ] = useState();

  const customAttribution = config.data.reduce((attr, dataset) =>
    dataset.attribution ? [ ...attr, dataset.attribution ] : attr, []);

  useEffect(() => {
    setSelection(null);

    const fitMap = search?.fitMap;
    if (fitMap && mapRef.current) {
      const bounds = search.bounds();
      if (bounds)
        mapRef.current.fitBounds(bounds, { padding: 40 , maxZoom: 14 });
    }
  }, [ search ]);

  useEffect(() => {
    // Map container gets hover element, 
    // so we can toggle cursor
    if (hover)
      ref.current.classList.add('hover');
    else
      ref.current.classList.remove('hover');
  }, [ hover ]);

  const onMapChange = useCallback(evt => {
    setViewstate(evt.viewState);
  }, []);

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
        feature: features[0],
        ...point
      };
  
      setHover(updated);
    } else {
      setHover(null);
    }
  }, []);

  const onClick = () => {
    if (hover) {
      const { node, feature } = hover;
      setHover(null);
      setSelection({ node, feature });
    } else {
      setSelection(null);
    }
  }

  const onZoom = inc => () => {
    const map = mapRef.current;
    const z = mapRef.current.getZoom();
    map.easeTo({ zoom: z + inc });
  }

  const onClosePopup = () =>
    setSelection(null);
  
  return (  
    <div 
      ref={ref}
      className={device === 'MOBILE' ? 'p6o-map-container mobile' : 'p6o-map-container'} >
      <ReactMapGL
        attributionControl={false}
        ref={mapRef}
        initialViewState={viewstate.latitude && viewstate.longitude && viewstate.zoom ? viewstate : {
          bounds: config.initial_bounds
        }}
        mapStyle={config.map_style}
        onLoad={props.onLoad}
        onMove={onMapChange}
        onClick={onClick}
        onMouseMove={onMouseMove}>

        {props.config.layers && props.config.layers.map(layer => parseLayerConfig(layer))}

        {search.facetDistribution ?
          <LayersCategorized 
            selectedMode={modeState}
            search={search} /> 
          
          :
          
          <LayersUncategorized 
            selectedMode={modeState}
            search={search} />
        }

        <AnimatePresence>
          {selection && 
            <SelectionPreview 
              {...selection}
              config={props.config} 
              onClose={onClosePopup} />
          }
        </AnimatePresence>

        {customAttribution.length > 0 &&
           <AttributionControl compact customAttribution={customAttribution} /> }
      </ReactMapGL>

      <Controls 
        fullscreenButton={props.isIFrame}
        isFullscreen={props.isFullscreen}
        onZoomIn={onZoom(1)}
        onZoomOut={onZoom(-1)} 
        onToggleFullscreen={props.onToggleFullscreen} />

      {props.children}

      {hover && <HoverBubble {...hover} />}
    </div>
  )

});

export default Map;