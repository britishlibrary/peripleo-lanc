import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

import { SIGNATURE_COLOR } from '../Colors';

import { pointStyle, pointCategoryStyle } from './styles/point';
import { clusterPointStyle, clusterLabelStyle } from './styles/cluster';
import { heatmapCoverageStyle, heatmapPointStyle } from './styles/heatmap';
import { colorHeatmapCoverage, colorHeatmapPoint } from './styles/colorHeatmap';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const LayersCategorized = props => {

  const [ flattened, setFlattened ] = useState();

  useEffect(() => {
    const layers = props.searchResults.getFacetValues(props.facet);

    const flattened = layers.reduce((flat, [, items], idx) => [
      ...flat,
      ...items.map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          color: SIGNATURE_COLOR[idx]
        }
      }))
    ], []);
    
    setFlattened(flattened);
  }, [ props.searchResults, props.facet ])

  return (
    <>
      {props.selectedMode === 'POINTS' &&
        <Source type="geojson" data={toFeatureCollection(flattened)}>
          <Layer 
            id="p6o-points"
            {...pointCategoryStyle()} />
        </Source>
      } 

      {props.selectedMode === 'CLUSTERS' && 
        <Source 
          type="geojson" 
          cluster={true}
          data={toFeatureCollection(flattened)}>

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
        <Source type="geojson" data={toFeatureCollection(flattened)}>
          <Layer
            id="p6o-heatmap"
            {...heatmapCoverageStyle()} />

          <Layer
            id="p6o-points"
            {...heatmapPointStyle()} /> 
        </Source>
      }

      {props.selectedMode === 'COLOURED_HEATMAP' &&
        props.searchResults.getFacetValues(props.facet).slice(0, 8).map(([layer, features], idx) =>
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

export default LayersCategorized;