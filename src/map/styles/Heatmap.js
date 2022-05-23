// https://gist.github.com/danieliser/b4b24c9f772066bcf0a6
const hexToRGBA = (hexCode, opacity = 1) => {  
  let hex = hexCode.replace('#', '');
  
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }    
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r},${g},${b},${opacity})`;
};

const colorScale = color => ([
  0,
  hexToRGBA(color, 0), 
  0.2,
  hexToRGBA(color, 0.1),
  0.4,
  hexToRGBA(color, 0.2),
  0.6,
  hexToRGBA(color, 0.4),
  0.8,
  hexToRGBA(color, 0.6),
  1,
  hexToRGBA(color, 0.7)
]);

export const colorHeatmapCoverage = color => ({
  'type': 'heatmap',
  'maxzoom': 9,
  'paint': {
    'heatmap-weight': 0.9,
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      9,
      3
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      ...colorScale(color)
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      2,
      9,
      20
    ],
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      1,
      9,
      0
    ]
  }
});

export const colorHeatmapPoint = color => ({
  'type': 'circle',
  'minzoom': 6,
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','colocated_records'], 0 ],
      0, 5,
      30, 24
    ],
    'circle-color': color,
    'circle-stroke-color': 'white',
    'circle-stroke-width': 1,
    'circle-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      8,
      1
    ],
    'circle-stroke-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      8,
      1
    ]
  }
});

export const heatmapCoverage = () => ({
  'type': 'heatmap',
  'maxzoom': 9,
  'paint': {
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'mag'],
      0,
      0,
      6,
      1
    ],
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      9,
      3
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      1,
      'rgb(178,24,43)'
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      2,
      9,
      20
    ],
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      1,
      9,
      0
    ]
  }
});

export const heatmapPoint = args => ({
  'type': 'circle',
  'minzoom': 6,
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','colocated_records'], 0 ],
      0, 5,
      30, 24
    ],
    'circle-color': 'red',
    'circle-stroke-color': 'white',
    'circle-stroke-width': 1,
    'circle-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      8,
      1
    ],
    'circle-stroke-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      8,
      1
    ]
  }
});