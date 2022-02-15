import Store from './Store';

/** 
 * Mostly a placeholder for future normalization options.
 * For now, simply normalizes everything to HTTP prefix.
 */
export const normalizeURI = uri =>
 uri.replace('https://', 'http://');

export const getBounds = node => {
 if (node.geometry) {
   if (node.geometry.type === 'Point') {
     const [x, y] = node.geometry.coordinates;
     return {minX: x, minY: y, maxX: x, maxY: y};
   } else {
     const [minX, minY, maxX, maxY] = bbox(feature);
     return {minX, minY, maxX, maxY};
   }
 } 
}

export default Store;

export * from './StoreContext';