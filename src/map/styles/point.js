export const pointStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': args?.radius || 4,
    'circle-color': args?.fill || '#fff',
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});

export const pointCategoryStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': args?.radius || 5,
    'circle-color': [ 'get', 'color' ],
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});
