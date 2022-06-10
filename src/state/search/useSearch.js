import { useContext } from 'react';
import { useRecoilState } from 'recoil';

import { StoreContext } from '../../store';
import { FacetsContext } from './FacetsContext';

import Search from './Search';
import { searchState } from '..';

import Filter from './Filter';

import GoogleAnalytics from '../GoogleAnalytics';

import { computeFacetDistribution } from './Facets';

const useSearch = () => {

  const { store } = useContext(StoreContext);

  const { availableFacets } = useContext(FacetsContext);

  const [ search, setSearchState ] = useRecoilState(searchState);

  /**
   * Executes a new search - warning costly operation!
   */
  const executeSearch = (query, filters, facet, fitMap) => {
    const all = query ?
      store.searchMappable(query) :
      store.getAllLocatedNodes();

    let preFilteredItems, postFilter;

    if (filters?.length > 0) {
      // All filters except on the current facet
      const preFilters = filters.filter(f => f.facet !== facet)
        .map(f => f.executable(availableFacets)).
        filter(f => f); // Remove undefined

      // The current facet filter (if any)
      postFilter = filters.find(f => f.facet === facet)?.executable(availableFacets);

      // Step 1: apply pre-filters
      preFilteredItems = all.filter(item => preFilters.every(fn => fn(item)));
    } else {
      preFilteredItems = all;
    }

    const facetDistribution = 
      facet &&
      availableFacets.find(f => f.name === facet) &&
      computeFacetDistribution(preFilteredItems, availableFacets.find(f => f.name === facet), postFilter);

    const items = facetDistribution ? 
      facetDistribution.items : preFilteredItems;

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
    GoogleAnalytics.tagFilter(filterFacet, filterValue);
    
    const { query, filters, facet } = search;

    // Is there already a filter on this facet?
    const existingFilter = filters.find(f => f.facet === filterFacet);

    let updatedFilters = [];

    if (existingFilter?.values.length === 1 && existingFilter?.values[0] === filterValue) {
      // Toggle last remaining value for the existing filter -> remove!
      updatedFilters = filters.filter(f => f.facet !== filterFacet);
    } else if (existingFilter) {
      // Toggle single value in existing filter
      updatedFilters = filters.map(f => {
        if (f.facet === filterFacet) {
          // Update this filter
          return f.values.includes(filterValue) ?
            // Remove this value
            new Filter(filterFacet, f.values.filter(v => v !== filterValue)) :
            // Append this value
            new Filter(filterFacet, [...f.values, filterValue ]);
        } else {
          return f;
        }
      });
    } else {
      // No existing filter on this facet yet - add
      updatedFilters = [
        ...filters,
        new Filter(filterFacet, filterValue)
      ];
    }
      
    // Setting a filter will auto-fit the map
    executeSearch(query, updatedFilters, facet, true);
  }

  const setFilters = (filterFacet, filterValues) => {
    if (filterValues?.length === 0)
      return clearFilter(filterFacet);

    const { query, filters, facet } = search;

    if (filters.find(f => f.facet === filterFacet)) {
      // Update existing filter
      const updatedFilters = filters.map(f => f.facet === filterFacet ?
        new Filter(filterFacet, filterValues) : f);
  
      executeSearch(query, updatedFilters, facet, true);  
    } else {
      // Append new filter
      executeSearch(query, [...filters, new Filter(filterFacet, filterValues)], facet, true);
    }
  }

  const clearFilter = filterFacet => {
    const { query, filters, facet } = search;

    const updatedFilters = filters.filter(f => f.facet !== filterFacet);

    executeSearch(query, updatedFilters, facet);
  }

  /**
   * Sets the current category facet. Re-runs the facet computation,
   * but not the search.
   */
  const setCategoryFacet = facetName => {
    const { query, filters } = search;
    executeSearch(query, filters, facetName);
  }

  return {
    search,
    refreshSearch,
    changeSearchQuery,
    clearSearchQuery,
    fitMap,
    toggleFilter,
    setFilters,
    clearFilter,
    setCategoryFacet,
    availableFacets: availableFacets.map(f => f.name)
  };

}

export default useSearch;