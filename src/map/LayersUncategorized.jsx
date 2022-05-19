import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

import { pointStyle } from './styles/Point';
import { clusterPointStyle, clusterLabelStyle } from './styles/Clusters';
import { heatmapCoverage, heatmapPoint } from './styles/Heatmap';
import { collapseColocatedFeatures } from './Utils';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const LayersUncategorized = props => {

  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(collapseColocatedFeatures(props.search.items));
  }, [ props.search.items ]);

  return (
    <>
      {props.selectedMode === 'points' &&
        <Source type="geojson" data={toFeatureCollection(items)}>
          <Layer 
            id="p6o-points"
            {...pointStyle({ fill: 'red', radius: 5 })} />
        </Source>
      } 

      {props.selectedMode === 'clusters' && 
        <Source 
          type="geojson" 
          cluster={true}
          data={toFeatureCollection(items)}>

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

      {props.selectedMode === 'heatmap' &&
        <Source type="geojson" data={toFeatureCollection(items)}>
          <Layer
            id="p6o-heatmap"
            {...heatmapCoverage()} />

          <Layer
            id="p6o-points"
            {...heatmapPoint()} /> 
        </Source>
      }
    </>
  )

}

export default LayersUncategorized;
