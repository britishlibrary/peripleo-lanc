import React, { useContext, useEffect, useState } from 'react';

import { StoreContext } from './store';
import Map from './map/Map';

const Peripleo = () => {

  const { store } = useContext(StoreContext);

  const [ config, setConfig ] = useState();

  const [ isDataLoaded, setIsDataLoaded ] = useState(false);

  useEffect(() => {
    fetch('peripleo.config.json')
      .then(response => response.json())
      .then(setConfig)
      .catch(error => {
        // TODO error
        console.error('Error loading Peripleo config. Please add a valid `peripleo.config.json` to your application root.');
      });
  }, []);

  useEffect(() => {
    if (config)
      store.init(config).then(() => setIsDataLoaded(true));
  }, [config]);

  // TODO LOADING screen
  return (
    <>
      {config && <Map config={config} loaded={isDataLoaded} /> }
    </>
  )

}

export default Peripleo;