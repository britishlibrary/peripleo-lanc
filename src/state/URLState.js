import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useDebounce } from 'use-debounce';

import { searchState, mapViewState, mapModeState } from '.';

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
    mode 
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
  
  const url = params.length > 0 ?
    fragment + '/' + params.join('+') : fragment;

  history.pushState(state, null, url);
}

const URLState = () => {
  const mapView = useRecoilValue(mapViewState);

  const mapMode = useRecoilValue(mapModeState);

  const search = useRecoilValue(searchState);

  const [ mapDebounced ] = useDebounce(mapView, 500);

  const [ state, setState ] = useState({ ...mapView });

  useEffect(() => {
    const { longitude, latitude, zoom } = mapView;
    setState({
      ...state, 
      longitude, latitude, zoom
    });
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
    }))
  }, [ search ]);

  useEffect(() => toURL(state), [ state ]);

  return null;
}

export default URLState;