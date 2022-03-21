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
  
export default class SearchResults {

  constructor(nodes) {
    // Total result item count
    this.total = nodes?.length || 0;

    // Result items
    this.items = nodes || [];

    // Experimental (and a bit hacked...)
    this.facets = [ 'dataset', 'has image', 'type'];
    this._facetValues = {};

    this.fitMap = false;
  }

  clone = () => {
    const r = new SearchResults();

    r.total = this.total;
    r.items = this.items;
    r.facets = this.facets;
    r._facetValues = this._facetValues;
    
    r.fitMap = this.fitMap;

    return r;
  }

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
    const fc = { 
      type: 'FeatureCollection', 
      features: this.items 
    };

    const [minX, minY, maxX, maxY] = bbox(fc);
    return [[minX, minY], [maxX, maxY]];
  }

}