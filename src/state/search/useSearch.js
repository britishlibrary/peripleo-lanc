import { useContext } from 'react';
import { useRecoilState } from 'recoil';

import { StoreContext } from '../../store';

import Search from './Search';
import { searchState } from '..';

import Filter from './Filter';

import { DEFAULT_FACETS, computeFacetDistribution } from './Facets';

const useSearch = () => {

  const { store } = useContext(StoreContext);

  const [ search, setSearchState ] = useRecoilState(searchState);

  /**
   * Executes a new search - warning costly operation!
   */
  const executeSearch = (query, filters, facet, fitMap) => {
    // TODO handle filters
    const items = query ?
      store.searchMappable(query) :
      store.getAllLocatedNodes();

    const facetDistribution = 
      facet && 
      DEFAULT_FACETS.find(f => f.name === facet) &&
      computeFacetDistribution(items, DEFAULT_FACETS.find(f => f.name === facet));

    setSearchState(new Search(query, filters, facet, fitMap, items, facetDistribution));
  }

  /** Re-runs the search (e.g. if data has changed meanwhile) **/
  const refreshSearch = () => 
    executeSearch(search.query, search.filters, search.facet, search.fitMap);

  /** 
   * Changes the search query, running a new search. Keeps filters and current facet.
   */
  const changeSearchQuery = query => 
    executeSearch(query, search?.filters, search?.facet, false);

  /**
   * Clears the search query, running a new search. Keeps filters
   * and current facet setting.
   */
  const clearSearchQuery = () =>
    changeSearchQuery(null);

  /**
   * Flips the fitMap switch (but doesn't re-run the search)
   */
  const fitMap = () => {
    const updated = search.clone();
    updated.fitMap = true;
    setSearchState(updated);
  }

  /**
   * Adds or removes a filter and re-runs the search
   */
  const toggleFilter = (filterFacet, filterValue) => {
    const { query, filters, facet, fitMap } = search;

    const filter = new Filter(filterFacet, filterValue);

    const updatedFilters = search.hasFilter(filter) ?
      // Remove
      filters.filter(f => !f.equals(filter)) :
      // Add
      [...filters, filter ];
      
    executeSearch(query, updatedFilters, facet, fitMap);
  }

  /**
   * Sets the current category facet. Re-runs the facet computation,
   * but not the search.
   */
  const setCategoryFacet = facetName => {
    const updated = search.clone();

    const facet = DEFAULT_FACETS.find(f => f.name === facetName);

    if (facet) {
      updated.facet = facetName;
      updated.facetDistribution = computeFacetDistribution(search.items, facet);
    } else {
      updated.facet = null;
      updated.facetDistribution = null;
    }
    
    setSearchState(updated);
  }

  return {
    search,
    refreshSearch,
    changeSearchQuery,
    clearSearchQuery,
    fitMap,
    toggleFilter,
    setCategoryFacet,
    availableFacets: DEFAULT_FACETS.map(f => f.name)
  };

}

export default useSearch;