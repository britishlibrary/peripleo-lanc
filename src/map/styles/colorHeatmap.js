const COLOR_SCALES = [
  [
    // Blue
    0,
    'rgba(0,0,255,0)',
    0.2,
    'rgba(0,0,255,0.1)',
    0.4,
    'rgba(0,0,255,0.2)',
    0.6,
    'rgba(0,0,255,0.4)',
    0.8,
    'rgba(0,0,255,0.6)',
    1,
    'rgba(0,0,255,0.7)',
  ], [
    // Red
    0,
    'rgba(255,0,0,0)',
    0.2,
    'rgba(255,0,0,0.1)',
    0.4,
    'rgba(255,0,0,0.2)',
    0.6,
    'rgba(255,0,0,0.4)',
    0.8,
    'rgba(255,0,0,0.6)',
    1,
    'rgba(255,0,0,0.7)',
  ],[
    // Green
    0,
    'rgba(0,255,0,0)',
    0.2,
    'rgba(0,255,0,0.1)',
    0.4,
    'rgba(0,255,0,0.2)',
    0.6,
    'rgba(0,255,0,0.4)',
    0.8,
    'rgba(0,255,0,0.6)',
    1,
    'rgba(0,255,0,0.7)',
  ]
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