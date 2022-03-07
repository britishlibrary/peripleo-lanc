import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { useSetRecoilState } from 'recoil';

import { StoreContext } from '../store';
import { mapState } from '../state';

import LayersCategorized from './LayersCategorized';
import LayersUncategorized from './LayersUncategorized';

import Zoom from './components/Zoom';
import Hover from './components/Hover';
import SelectionPreview from './components/SelectionPreview';

import { geojsonLineStyle } from './styles/backgroundLayers';

/** TODO temporary - for user testing **/
import VariantsRadioButton from '../usertesting/VariantsRadioButton';

const Map = React.forwardRef((props, ref) => {

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { config } = props;

  const setViewstate = useSetRecoilState(mapState);

  const [ hover, setHover ] = useState();

  const [ selection, setSelection ] = useState();

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

  const [ selectedMode, setSelectedMode ] = useState('POINTS');

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