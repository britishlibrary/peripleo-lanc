import bbox from '@turf/bbox';
  
export default class Search {

  constructor(query, filters, facet, fitMap, items, facetDistribution) {
    this.query = query;

    this.filters = filters || [];

    this.facet = facet;

    this.fitMap = !!fitMap;

    this.items = items || [];

    this.total = this.items.length;

    this.facetDistribution = facetDistribution;
  }

  clone = () =>
    new Search(this.query, this.filters, this.facet, this.fitMap, this.items, this.facetDistribution);

  hasAnyFilters = () =>
    this.filters.length > 0;

  hasFilter = filter =>
    this.filters.find(f => f.equals(filter));

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