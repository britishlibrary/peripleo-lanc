import { atom } from 'recoil';

import SearchResults from '../SearchResults';

const { hash } = window.location;

const initialViewstate = (hash.match(/\//g) || []).length < 3 ?
  {} : {
    zoom: parseFloat(hash.split('/')[1]),
    longitude: parseFloat(hash.split('/')[2]), 
    latitude: parseFloat(hash.split('/')[3]) 
  }

const initialParams = (hash.match(/\//g) || []).length !== 4 ?
  {} :
  Object.fromEntries(hash.substring(hash.lastIndexOf('/') + 1)
    .split('&')
    .map(t => t.split('=')));

export const categoryFacetState = atom({
  key: 'categoryFacet',
  default: initialParams.facet
});

export const searchResultState = atom({
  key: 'searchResults',
  default: new SearchResults()
});

export const mapState = atom({
  key: 'map',
  default: initialViewstate
});

export const selectedState = atom({
  key: 'selected',
  default: null
}); 