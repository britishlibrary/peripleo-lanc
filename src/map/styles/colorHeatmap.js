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

const COLOR_SCALES = [
  colorScale('#0000ff'),
  colorScale('#ff0000'),
  colorScale('#00ff00'),
  colorScale('#0000ff'),
  colorScale('#ff0000'),
  colorScale('#00ff00'),
  colorScale('#0000ff'),
  colorScale('#ff0000'),
  colorScale('#00ff00')
];

export const colorHeatmapCoverage = idx => ({
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
      ...COLOR_SCALES[idx]
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

const POINT_COLORS = [
  'blue', 'red', 'green',
  'blue', 'red', 'green',
  'blue', 'red', 'green'
];

export const colorHeatmapPoint = idx => ({
  'type': 'circle',
  'minzoom': 6,
  'paint': {
    'circle-radius': 5,
    'circle-color': POINT_COLORS[idx],
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