import React from 'react';
import { Source, Layer } from 'react-map-gl';

import { pointStyle } from './styles/point';
import { clusterPointStyle, clusterLabelStyle } from './styles/cluster';
import { heatmapCoverageStyle, heatmapPointStyle } from './styles/heatmap';
import { colorHeatmapCoverage, colorHeatmapPoint } from './styles/colorHeatmap';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const LayersUncategorized = props => {

  // Default, so we can demo multi-color heatmap
  const layers = props.searchResults.getFacetValues('dataset');

  return (
    <>
      {props.selectedMode === 'POINTS' &&
        <Source type="geojson" data={toFeatureCollection(props.searchResults.items)}>
          <Layer 
            id="p6o-points"
            {...pointStyle({ fill: 'red', radius: 5 })} />
        </Source>
      } 

      {props.selectedMode === 'CLUSTERS' && 
        <Source 
          type="geojson" 
          cluster={true}
          data={toFeatureCollection(props.searchResults.items)}>

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

      {props.selectedMode === 'HEATMAP' &&
        <Source type="geojson" data={toFeatureCollection(props.searchResults.items)}>
          <Layer
            id="p6o-heatmap"
            {...heatmapCoverageStyle()} />

          <Layer
            id="p6o-points"
            {...heatmapPointStyle()} /> 
        </Source>
      }

      {props.selectedMode === 'COLOURED_HEATMAP' &&
        layers.map(([layer, features], idx) =>
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
    </>
  )

}

export default LayersUncategorized;
