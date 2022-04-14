import React from 'react';
import { Source, Layer } from 'react-map-gl';

import { geojsonLineStyle } from './styles/BackgroundLayers';

const parseRasterConfig = config => (
  <Source
    key={config.name}
    type="raster"
    tiles={config.tiles}
    tileSize={config.tileSize}
    attribution={config.attribution}>

    <Layer
      type="raster"
      minzoom={config.minzoom}
      maxzoom={config.maxzoom} />

  </Source>
)

const parseGeoJSONConfig = config => (
  <Source 
    key={config.name}
    type="geojson" 
    data={config.src}>

    <Layer
      {...geojsonLineStyle(config.color)} />

  </Source>
)

export const parseLayerConfig = config => {
  if (config.type === 'raster') {
    return parseRasterConfig(config);
  } else if (config.type === 'geojson') {
    return parseGeoJSONConfig(config);
  }
}