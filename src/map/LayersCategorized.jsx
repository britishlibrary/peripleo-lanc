import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

import { SIGNATURE_COLOR } from '../Colors';

import { pointStyle, pointCategoryStyle } from './styles/Point';
import { clusterPointStyle, clusterLabelStyle } from './styles/Clusters';
import { colorHeatmapCoverage, colorHeatmapPoint } from './styles/Heatmap';
import { getTopEight } from '../hud/search/Facets';
import { collapseColocatedFeatures } from './Utils';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const getLayers = search => {
  // For every feature, we'll check the facet value, and assign it 
  // to the first layer it matches. In other words: the feature will
  // get the color of the most common *active* facet value.
  // (Re "active": that means we need to pick different colors based
  // on whether there's currently a filter)
  const currentFilter = search.filters.find(f => 
    f.facet === search.facet);

  const { counts, items } = search.facetDistribution;

  // Items with co-locations removed
  const deduplicatedItems = collapseColocatedFeatures(items);

  // All facet values (defines layer colors!)
  const allFacetValues = getTopEight(counts, currentFilter?.values).map(t => t[0]);

  // Just the active values - all, or a subset if filter is enabled
  const activeValues = currentFilter ?
    allFacetValues.filter(value => currentFilter?.values.includes(value)) :
    allFacetValues;

  // Re-order active values if necessary
  if (currentFilter)
    activeValues.sort((a, b) => allFacetValues.indexOf(a) - allFacetValues.indexOf(b));

  const layers = Object.fromEntries(activeValues.map(label => [ label, [] ]));
  const unassigned = [];

  deduplicatedItems.forEach(item => {
    const values = item._facet?.values || [];

    const firstMatch = activeValues.find(l => values.indexOf(l) > -1);
    if (firstMatch)
      layers[firstMatch].push(item);
    else
      unassigned.push(item);
  });

  // Map to array of entries + legend color
  const getColor = label => SIGNATURE_COLOR[allFacetValues.indexOf(label)];
  
  const arr = Object.entries(layers)
    .filter(t => t[1].length > 0)
    .map(t => [...t, getColor(t[0])]);

  arr.sort((a, b) => a[1].length - b[1].length);

  return [
    ...arr,
    ['__unassigned', unassigned, '#a2a2a2' ]
  ].slice().reverse(); // Largest layer at bottom
}

const LayersCategorized = props => {

  const [ features, setFeatures ] = useState();

  const [ layers, setLayers ] = useState();

  useEffect(() => {
    if (props.selectedMode === 'heatmap') {
      setLayers(getLayers(props.search));       
    } else {
      const { counts, items } = props.search.facetDistribution;

      // Items with co-locations removed
      const deduplicatedItems = collapseColocatedFeatures(items);

      // Just the facet value labels, in order of the legend
      const currentFacets = 
        getTopEight(counts, props.search.filters.find(f => f.facet === props.search.facet)?.values)
          .map(t => t[0]);
            
      // Current filter on this facet, if any
      const currentFilter = props.search.filters.find(f => 
        f.facet === props.search.facet);
      
      // Colorize the features according to their facet values
      const colorized = deduplicatedItems.map(feature => {
        // Facet values assigned to this feature
        const values = feature._facet?.values || [];

        // Color the feature by the top facet *that's currently active*!
        // That means: we need to use different colors depending on whether
        // there's currently a filter set on this facet
        const topValue = values.find(value => {
          if (currentFilter) {
            return currentFacets.indexOf(value) > -1 && currentFilter.values.includes(value);
          } else {
            return currentFacets.indexOf(value) > -1;
          }
        });

        const color = topValue ?
          SIGNATURE_COLOR[currentFacets.indexOf(topValue)] : '#a2a2a2';

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
      {props.selectedMode === 'points' &&
        <Source type="geojson" data={toFeatureCollection(features)}>
          <Layer 
            id="p6o-points"
            {...pointCategoryStyle()} />
        </Source>
      } 

      {props.selectedMode === 'clusters' && 
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

      {props.selectedMode === 'heatmap' &&
        layers?.map(([layer, features, color]) => 
          <Source key={layer} type="geojson" data={toFeatureCollection(features)}>
            <Layer
              id={`p6o-heatmap-${layer}`}
              {...colorHeatmapCoverage(color)} />
          
            <Layer
              id={`p6o-points-${layer}`}
              {...colorHeatmapPoint(color)} /> 
          </Source>
        )
      }
    </>
  )

}

export default LayersCategorized;