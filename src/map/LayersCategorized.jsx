import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

import { SIGNATURE_COLOR } from '../Colors';

import { pointStyle, pointCategoryStyle } from './styles/point';
import { clusterPointStyle, clusterLabelStyle } from './styles/cluster';
import { heatmapCoverageStyle, heatmapPointStyle } from './styles/heatmap';
import { colorHeatmapCoverage, colorHeatmapPoint } from './styles/colorHeatmap';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const getLayers = facetDistribution => {
  const { counts, items } = facetDistribution

  const topValues = counts.slice(0, 8).map(t => t[0]);

  // For every feature, we'll check the facet value, and assign it 
  // to the first layer it matches. In other words: the feature will
  // get the color of the most common facet value.
  const layers = Object.fromEntries(topValues.map(label => [ label, [] ]));

  items.forEach(item => {
    const values = item._facet?.values || [];

    const firstMatch = topValues.find(l => values.indexOf(l) > -1);
    if (firstMatch) {
      layers[firstMatch].push(item);
    } else {
      // TODO 'untyped'
    }
  });

  const arr = Object.entries(layers);
  arr.sort((a, b) => b[1].length - a[1].length);
  return arr;
}

const LayersCategorized = props => {

  const [ features, setFeatures ] = useState();

  const [ layers, setLayers ] = useState();

  useEffect(() => {
    if (props.selectedMode === 'COLOURED_HEATMAP') {
      setLayers(getLayers(props.search.facetDistribution));       
    } else {
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
    }
  }, [ props.search, props.facet, props.selectedMode ])

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
        layers?.map(([layer, features], idx) =>
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