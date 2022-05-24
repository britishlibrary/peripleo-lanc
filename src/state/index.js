import { atom } from 'recoil';

import Search from './search/Search';
import Filter, { parseFilterDefinition } from './search/Filter';

/** Parse startup state from URL **/
const { hash } = window.location;

/** Map state (first three args) **/
const initialMapViewState = (hash.match(/\//g) || []).length < 3 ?
  {} : {
    zoom: parseFloat(hash.split('/')[1]),
    longitude: parseFloat(hash.split('/')[2]), 
    latitude: parseFloat(hash.split('/')[3]) 
  }

/** All other start args (fourth args) **/
const initialParams = (hash.match(/\//g) || []).length !== 4 ?
  {} :
  Object.fromEntries(hash.substring(hash.lastIndexOf('/') + 1)
    .split('+')
    .map(t => t.split('=')));

/** Current map view state: zoom, longitude, latitude **/
export const mapViewState = atom({
  key: 'mapView',
  default: initialMapViewState
});

/** Map mode state: points, clusters, heatmap **/
export const mapModeState = atom({
  key: 'mapMode',
  default: initialParams.mode || 'points'
});

/** Whether the HUD is currently open **/
export const hudOpenState = atom({
  key: 'hudOpen',
  default: false
});

/** Current search (query, filter, facet) + search results **/
export const searchState = atom({
  key: 'search',
  default: new Search(
    null, // query
    parseFilterDefinition(initialParams.filters).map(f => 
      new Filter(f.name, f.values.map(str => decodeURIComponent(str)))),
    initialParams.facet
  )
});

export const deviceState = atom({
  key: 'device',
  default: window.screen.availWidth <= 800 ? 'MOBILE' : 'DESKTOP'
});

export const selectedState = atom({
  key: 'selected',
  default: initialParams.selected ? decodeURIComponent(initialParams.selected) : null
});