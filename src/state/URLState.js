import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useDebounce } from 'use-debounce';

import { mapState } from '.';

const toURL = state => {
  const { longitude, latitude, zoom } = state;
  if (longitude && latitude && zoom)
    history.pushState(state, null, `#/${zoom.toFixed(2)}/${longitude.toFixed(4)}/${latitude.toFixed(4)}`);
}

const URLState = props => {

  const [ state, setState ] = useState({});

  const map = useRecoilValue(mapState);

  const [ mapDebounced ] = useDebounce(map, 500);

  useEffect(() => {
    const { longitude, latitude, zoom } = map;
    setState({
      ...state, 
      longitude, latitude, zoom
    });
  }, [ mapDebounced ]);

  useEffect(() => toURL(state), [ state ]);

  return null;

}

export default URLState;