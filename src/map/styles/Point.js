export const pointStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','colocated_records'], 0 ],
      0, 5,
      30, 24
    ],
    'circle-color': args?.fill || '#fff',
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});

export const pointCategoryStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','colocated_records'], 0 ],
      0, 5,
      30, 24
    ],
    'circle-color': [ 'get', 'color' ],
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});
