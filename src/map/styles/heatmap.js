export const heatmapCoverageStyle = () => ({
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

export const heatmapPointStyle = args => ({
  'type': 'circle',
  'minzoom': 6,
  'paint': {
    'circle-radius': args?.radius || 5,
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