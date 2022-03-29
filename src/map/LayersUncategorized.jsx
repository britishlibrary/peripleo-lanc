import React from 'react';
import { Source, Layer } from 'react-map-gl';

import { pointStyle } from './styles/point';
import { clusterPointStyle, clusterLabelStyle } from './styles/cluster';
import { heatmapCoverageStyle, heatmapPointStyle } from './styles/heatmap';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const LayersUncategorized = props => {

  return (
    <>
      {props.selectedMode === 'points' &&
        <Source type="geojson" data={toFeatureCollection(props.search.items)}>
          <Layer 
            id="p6o-points"
            {...pointStyle({ fill: 'red', radius: 5 })} />
        </Source>
      } 

      {props.selectedMode === 'clusters' && 
        <Source 
          type="geojson" 
          cluster={true}
          data={toFeatureCollection(props.search.items)}>

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
        <Source type="geojson" data={toFeatureCollection(props.search.items)}>
          <Layer
            id="p6o-heatmap"
            {...heatmapCoverageStyle()} />

          <Layer
            id="p6o-points"
            {...heatmapPointStyle()} /> 
        </Source>
      }
    </>
  )

}

export default LayersUncategorized;
