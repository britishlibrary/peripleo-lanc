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

  const [ features, setFeatures ] = useState();

  useEffect(() => {
    const { counts, items } = props.search.facetDistribution;

    // Just the facet value labels, in order of the legend
    const currentFacets = counts.map(c => c[0]);

    // Colorize the features according to their facet values
    const colorized = items.map(feature => {
      // Facet values assigned to this feature
      const values = feature._facet?.values || [];
      
      const color = values.length === 1 ?
        SIGNATURE_COLOR[currentFacets.indexOf(values[0])] : 'grey';

      return {
        ...feature,
        properties: {
          ...feature.properties,
          color
        }
      }
    });

    setFeatures(colorized);
  }, [ props.search, props.facet ])

  return (
    <>
      {props.selectedMode === 'POINTS' &&
        <Source type="geojson" data={toFeatureCollection(features)}>
          <Layer 
            id="p6o-points"
            {...pointCategoryStyle()} />
        </Source>
      } 

      {props.selectedMode === 'CLUSTERS' && 
        <Source 
          type="geojson" 
          cluster={true}
          data={toFeatureCollection(features)}>

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
        <Source type="geojson" data={toFeatureCollection(features)}>
          <Layer
            id="p6o-heatmap"
            {...heatmapCoverageStyle()} />

          <Layer
            id="p6o-points"
            {...heatmapPointStyle()} /> 
        </Source>
      }

      {props.selectedMode === 'COLOURED_HEATMAP' &&
        props.search.getFacetValues(props.facet).slice(0, 8).map(([layer, features], idx) =>
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