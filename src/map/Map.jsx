import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, { AttributionControl } from 'react-map-gl';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AnimatePresence } from 'framer-motion';

import useSearch from '../state/search/useSearch';
import { StoreContext } from '../store';
import { selectedState, mapViewState, mapModeState, deviceState } from '../state';

import { parseLayerConfig } from './BaseLayers';
import LayersCategorized from './LayersCategorized';
import LayersUncategorized from './LayersUncategorized';

import Controls from './controls/Controls';
import HoverBubble from './HoverBubble';
import SelectionPreview from './selection/SelectionPreview';
import MyLocation from './MyLocation';

const Map = React.forwardRef((props, ref) => {

  const { config } = props;

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { search } = useSearch();

  const [ viewstate, setViewstate ] = useRecoilState(mapViewState);

  const modeState = useRecoilValue(mapModeState);

  const device = useRecoilValue(deviceState);

  const [ hover, setHover ] = useState();

  const [ selectedId, setSelectedId ] = useRecoilState(selectedState);

  const [ selection, setSelection ] = useState();

  const customAttribution = config.data.reduce((attr, dataset) =>
    dataset.attribution ? [ ...attr, dataset.attribution ] : attr, []);

  useEffect(() => {
    const fitMap = search?.fitMap;
    if (fitMap && mapRef.current) {
      setSelection(null);
      setSelectedId(null);

      const bounds = search.bounds();
      if (bounds)
        mapRef.current.fitBounds(bounds, { padding: 40 , maxZoom: 14 });
    }
  }, [ search ]);

  // Sync selection state downwards
  useEffect(() => {    
    const currentSelectionId = selection?.nodeList ?
      selection.nodeList[0].id : selection?.node.id;
    
    if (selectedId && currentSelectionId !== selectedId) {
      const node = store.getNode(selectedId);
      if (node)
        setSelection({ node });
    } else if (!selectedId && selection) {
      setSelection(null);
    } 
  }, [ selectedId, search ]);

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
      setHover(null);

      const { node, feature } = hover;
      const colocated = feature.properties.colocated_records || 0;

      if (colocated) {
        const neighbours = store.getNearestNeighbours(node, colocated);
        setSelection({ nodeList: [ node, ...neighbours ], feature });
      } else {
        setSelection({ node, feature });
      }

      // Sync state up
      setSelectedId(node.id);
    } else {
      setSelection(null);

      // Sync state up
      setSelectedId(null);
    }
  }

  const onZoom = inc => () => {
    const map = mapRef.current;
    const z = mapRef.current.getZoom();
    map.easeTo({ zoom: z + inc });
  }

  const onClosePopup = () => {
    setSelection(null);
    setSelectedId(null);
  }

  const moveIntoView = (coord, bounds) => {
    const PADDING = 30;

    const map = mapRef.current;
    const { width, height } = map.getCanvas();
    const point = map.project(coord);

    let dx, dy;

    if (bounds.top < 0) {
      dy = point.y - bounds.height - PADDING;
    } else if ((height - bounds.top - bounds.height) < 0) {
      dy = point.y + bounds.height - height + PADDING; 
    } else {
      dy = 0;
    }

    if (bounds.left < 0){ 
      dx = bounds.width - point.x + PADDING;
    } else if ((width - bounds.left - bounds.width) < 0) {
      dx = width - point.x - bounds.width - PADDING;
    } else {
      dx = 0;
    }

    map.panBy([dx, dy]);
  }

  const panTo = (lat, lon) =>
    mapRef.current.flyTo({ center: [lon,lat], zoom: 14 });
  
  return (  
    <div 
      ref={ref}
      className={device === 'MOBILE' ? 'p6o-map-container mobile' : 'p6o-map-container'} >

      <ReactMapGL
        attributionControl={false}
        pitchWithRotate={false}
        dragRotate={false}
        clickTolerance={device === 'MOBILE' ? 10 : 3}
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
              moveIntoView={moveIntoView}
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

      {!config.disableMyLocation && <MyLocation onPanTo={panTo} /> }

      {props.children}

      {hover && <HoverBubble {...hover} />}
    </div>
  )

});

export default Map;