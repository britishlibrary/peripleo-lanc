import bbox from '@turf/bbox';

const groupBy = (arr, key) =>
  arr.reduce((grouped, obj) => {
    (grouped[obj[key]] = grouped[obj[key]] || []).push(obj);
    return grouped;
  }, {});

const toSortedArray = obj => {
  const entries = Object.entries(obj);
  entries.sort((a, b) => b[1].length - a[1].length);
  return entries;
}
  
export default class Search {

  constructor(query, filters, fitMap, items) {
    this.query = query;

    this.filters = filters;

    this.fitMap = !!fitMap;

    this.items = items || [];

    this.total = this.items.length;

    // Experimental (and a bit hacked...)
    this.facets = [ 'dataset', 'has image', 'type'];
    this._facetValues = {};
  }

  clone = () =>
    new Search(this.query, this.filters, this.fitMap, this.items);

  // Experimental
  getFacetValues = facet => {
    if (facet === 'dataset') {
      return toSortedArray(groupBy(this.items, 'dataset'));
    } else if (facet === 'has image') {
      const has = this.items.filter(i => i.depictions?.length > 0);
      const hasnt = this.items.filter(i => !i.depictions?.length > 0);

      return [
        ['With image', has],
        ['Without image', hasnt]
      ]
    } else if (facet === 'type') {
      return toSortedArray(this.items.reduce((grouped, item) => {
        // This is a multi-value facet!
        const labels = item.types?.map(t => t.label) || [];
        
        for (const label of labels) {
          (grouped[label] = grouped[label] || []).push(item);
        }

        if (labels.length === 0)
          (grouped.untyped = grouped.untyped || []).push(item);

        return grouped;
      }, {}));
    }
  }

  bounds = () => {
    if (this.items?.length > 0) {
      const [ minX, minY, maxX, maxY ] = bbox({ 
        type: 'FeatureCollection', 
        features: this.items 
      });

      // MapLibre format
      return [ [minX, minY], [maxX, maxY] ];
    } else {
      return null;
    }
  }

}