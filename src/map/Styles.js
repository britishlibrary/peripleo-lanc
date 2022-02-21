export const pointStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': args?.radius || 4,
    'circle-color': args?.fill || '#fff',
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});

export const coverageHeatmapStyle = args => ({
  'type': 'heatmap',
  'maxzoom': 9,
  'paint': {
    // Increase the heatmap weight based on frequency and property 'records'
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'records'],
      0,
      0,
      6,
      1
    ],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      9,
      3
    ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
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
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      2,
      9,
      20
    ],
    // Transition from heatmap to circle layer by zoom level
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

export const coveragePointStyle = args => ({
  'type': 'circle',
  'minzoom': 6,
  'paint': {
    'circle-radius': args?.radius || 5,
    'circle-color': args?.fill || 'red',
    /* Size circle radius by number of records and zoom level
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      ['interpolate', ['linear'], ['get', 'records'], 1, 1, 6, 4],
      16,
      ['interpolate', ['linear'], ['get', 'records'], 1, 5, 6, 50]
    ],
    // Color circle by number of records
    'circle-color': [
      'interpolate',
      ['linear'],
      ['get', 'records'],
      1,
      'rgba(33,102,172,0)',
      2,
      'rgb(103,169,207)',
      3,
      'rgb(209,229,240)',
      4,
      'rgb(253,219,199)',
      5,
      'rgb(239,138,98)',
      6,
      'rgb(178,24,43)'
    ],
    */
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