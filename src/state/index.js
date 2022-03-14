import { atom } from 'recoil';

import SearchResults from '../SearchResults';

const initialParams = new URLSearchParams(window.location.search);

export const searchQueryState = atom({
  key: 'searchQuery',
  default: ''
});

export const categoryFacetState = atom({
  key: 'categoryFacet',
  default: initialParams.get('facet')
});

export const searchResultState = atom({
  key: 'searchResults',
  default: new SearchResults()
});

export const mapState = atom({
  key: 'map',
  default: {}
});

export const selectedState = atom({
  key: 'selected',
  default: null
}); 