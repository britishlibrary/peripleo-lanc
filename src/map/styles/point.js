export const pointStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': args?.radius || 4,
    'circle-color': args?.fill || '#fff',
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});
