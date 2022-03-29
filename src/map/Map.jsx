import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { useRecoilState, useRecoilValue } from 'recoil';

import useSearch from '../state/search/useSearch';
import { StoreContext } from '../store';
import { mapViewState, mapModeState } from '../state';

import LayersCategorized from './LayersCategorized';
import LayersUncategorized from './LayersUncategorized';

import Controls from './controls/Controls';
import HoverBubble from './HoverBubble';
import SelectionPreview from './selection/SelectionPreview';

import { geojsonLineStyle } from './styles/BackgroundLayers';

const Map = React.forwardRef((props, ref) => {

  const { config } = props;

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { search } = useSearch();

  const [ viewstate, setViewstate ] = useRecoilState(mapViewState);

  const modeState = useRecoilValue(mapModeState);

  const [ hover, setHover ] = useState();

  const [ selection, setSelection ] = useState();

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

  useEffect(() => {
    setSelection(null);

    const fitMap = search?.fitMap;
    if (fitMap && mapRef.current) {
      const bounds = search.bounds();
      if (bounds)
        mapRef.current.fitBounds(bounds, { padding: 40 });
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
    <div className="p6o-map-container" ref={ref}>
      <ReactMapGL
        ref={mapRef}
        initialViewState={viewstate.latitude && viewstate.longitude && viewstate.zoom ? viewstate : {
          bounds: config.initial_bounds
        }}
        mapStyle={style}
        onLoad={props.onLoad}
        onMove={onMapChange}
        onClick={onClick}
        onMouseMove={onMouseMove}>

        {props.config.layers && props.config.layers.map(layer =>
          <Source key={layer.name} type="geojson" data={layer.src}>
            <Layer
              {...geojsonLineStyle(layer.color)} />
          </Source>
        )}

        {search.facetDistribution ?
          <LayersCategorized 
            selectedMode={modeState}
            search={search} /> 
          
          :
          
          <LayersUncategorized 
            selectedMode={modeState}
            search={search} />
        }

        {selection && 
          <SelectionPreview 
            {...selection}
            config={props.config} 
            onClose={onClosePopup} />
        }
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