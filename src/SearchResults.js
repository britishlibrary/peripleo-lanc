const groupBy = (arr, key) =>
  arr.reduce((grouped, obj) => {
    (grouped[obj[key]] = grouped[obj[key]] || []).push(obj);
    return grouped;
  }, {});
  
export default class SearchResults {

  constructor(nodes) {
    // Total result item count
    this.total = nodes.length;

    // Result items
    this.items = nodes;

    // Experimental (and a bit hacked...)
    this.facets = [ 'dataset', 'has_thumbnail', 'types.label'];
    this._facetValues = {};
  }

  // Experimental
  getFacetValues = facet => {
    if (facet === 'dataset') {
      return groupBy(this.items, 'dataset');
    }
  }

}