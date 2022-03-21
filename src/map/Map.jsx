import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { useRecoilState } from 'recoil';

import { StoreContext } from '../store';
import { mapState } from '../state';

import LayersCategorized from './LayersCategorized';
import LayersUncategorized from './LayersUncategorized';

import Zoom from './controls/Zoom';
import HoverBubble from './HoverBubble';
import SelectionPreview from './selection/SelectionPreview';

import { geojsonLineStyle } from './styles/backgroundLayers';

/** TODO temporary - for user testing **/
import VariantsRadioButton from '../usertesting/VariantsRadioButton';

const Map = React.forwardRef((props, ref) => {

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { config } = props;

  const [ viewstate, setViewstate ] = useRecoilState(mapState);

  const [ hover, setHover ] = useState();

  const [ selection, setSelection ] = useState();

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

  const [ selectedMode, setSelectedMode ] = useState('POINTS');

  useEffect(() => {
    setSelection(null);

    const fitMap = props.searchResults?.fitMap;
    if (fitMap && mapRef.current)
      mapRef.current.fitBounds(props.searchResults.bounds(), { padding: 40 });
  }, [ props.searchResults ]);

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

        {props.currentFacet ?
          <LayersCategorized 
            selectedMode={selectedMode}
            searchResults={props.searchResults} 
            facet={props.currentFacet} /> 
          
          :
          
          <LayersUncategorized 
            selectedMode={selectedMode}
            searchResults={props.searchResults} />
        }

        {selection && 
          <SelectionPreview 
            {...selection}
            config={props.config} 
            onClose={onClosePopup} />
        }
      </ReactMapGL>

      {/* USERTESTING */}
      <VariantsRadioButton 
        selected={selectedMode}
        onSelect={setSelectedMode} />

      <Zoom 
        fullscreenButton={props.isIFrame}
        onZoomIn={onZoom(1)}
        onZoomOut={onZoom(-1)} 
        onGoFullscreen={props.onGoFullscreen} />

      {props.children}

      {hover && <HoverBubble {...hover} />}
    </div>
  )

});

export default Map;