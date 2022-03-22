import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useDebounce } from 'use-debounce';

import { searchState, mapState } from '.';

const toURL = state => {
  const { longitude, latitude, zoom, facet } = state;

  let fragment = '#/';

  const params = [];

  // Map viewport
  if (longitude && latitude && zoom)
    fragment = fragment + `${zoom.toFixed(2)}/${longitude.toFixed(4)}/${latitude.toFixed(4)}`;
  else 
    fragment = fragment + '?/?/?';

  // Facet value (if any)
  if (facet)
    params.push(`facet=${facet}`);
  
  const url = params.length > 0 ?
    fragment + '/' + params.join('&') : fragment;

  history.pushState(state, null, url);
}

const URLState = props => {

  const map = useRecoilValue(mapState);

  const search = useRecoilValue(searchState)

  const [ mapDebounced ] = useDebounce(map, 500);

  const [ state, setState ] = useState({ ...map });

  useEffect(() => {
    const { longitude, latitude, zoom } = map;
    setState({
      ...state, 
      longitude, latitude, zoom
    });
  }, [ mapDebounced ]);

  useEffect(() => {
    setState({...state, facet: search.facet })
  }, [ search ]);

  useEffect(() => toURL(state), [ state ]);

  return null;
}

export default URLState;