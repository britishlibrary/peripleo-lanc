import { atom } from 'recoil';

import Search from './search/Search';

/** Parse startup state from URL **/
const { hash } = window.location;

/** Map state (first three args) **/
const initialMapState = (hash.match(/\//g) || []).length < 3 ?
  {} : {
    zoom: parseFloat(hash.split('/')[1]),
    longitude: parseFloat(hash.split('/')[2]), 
    latitude: parseFloat(hash.split('/')[3]) 
  }

/** All other start args (fourth args) **/
const initialParams = (hash.match(/\//g) || []).length !== 4 ?
  {} :
  Object.fromEntries(hash.substring(hash.lastIndexOf('/') + 1)
    .split('&')
    .map(t => t.split('=')));

/** Current map state: zoom, longitude, latitude **/
export const mapState = atom({
  key: 'map',
  default: initialMapState
});

/** Current search (query, filter, facet) + search results **/
export const searchState = atom({
  key: 'search',
  default: null
});

/** Current category facet **/
export const categoryFacetState = atom({
  key: 'categoryFacet',
  default: initialParams.facet
});

/**
 * TODO
 * Current selection
 */
export const selectedState = atom({
  key: 'selected',
  default: null
});