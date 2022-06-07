import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useDebounce } from 'use-debounce';

import GoogleAnalytics from './GoogleAnalytics';

import { searchState, selectedState, mapViewState, mapModeState } from '.';

export const serializeFilterDefinition = filters => filters
  .map(f => `${encodeURIComponent(f.name)}[${f.values.map(value =>
    `(${encodeURIComponent(value)})`
  ).join(',')}]`)
  .join(',')

const toURL = state => {
  const { 
    zoom,
    longitude, 
    latitude, 
    facet, 
    filters,
    mode,
    selected
  } = state;

  let fragment = '#/';

  const params = [];

  // Map viewport
  if (longitude && latitude && zoom)
    fragment = fragment + `${zoom.toFixed(2)}/${longitude.toFixed(4)}/${latitude.toFixed(4)}`;
  else 
    fragment = fragment + '?/?/?';

  // Map mode (unless default)
  if (mode)
    params.push(`mode=${mode}`);

  // Facet value (if any)
  if (facet)
    params.push(`facet=${facet}`);

  // Filters (if any)
  if (filters && filters.length > 0)
    params.push(`filters=${serializeFilterDefinition(filters)}`);

  // Selected (if any)
  if (selected)
    params.push(`selected=${encodeURIComponent(selected)}`);

  const url = params.length > 0 ?
    fragment + '/' + params.join('+') : fragment;

  history.pushState(state, null, url);
}

const URLState = () => {
  const mapView = useRecoilValue(mapViewState);

  const mapMode = useRecoilValue(mapModeState);

  const search = useRecoilValue(searchState);

  const selected = useRecoilValue(selectedState);

  const [ mapDebounced ] = useDebounce(mapView, 500);

  const [ state, setState ] = useState({ ...mapView, selected });

  useEffect(() => {
    const { longitude, latitude, zoom } = mapView;
    setState(state => ({
      ...state, 
      longitude, latitude, zoom
    }));
  }, [ mapDebounced ]);

  useEffect(() => {
    setState(state => ({ ...state, mode: mapMode }));
  }, [ mapMode ]);

  useEffect(() => {
    setState(state => ({
      ...state, 
      facet: search.facet,
      // Clone immutable filters
      filters: search.filters?.map(f => ({ name: f.facet, values: f.values }))
    }));

    // Tag search action on GA
    GoogleAnalytics.tagSearch(search);
  }, [ search ]);

  useEffect(() => {
    setState(state => ({ ...state, selected }));

    // Tag select action on GA
    GoogleAnalytics.tagSelection(selected);
  }, [ selected ]);

  useEffect(() => toURL(state), [ state ]);

  return null;
}

export default URLState;