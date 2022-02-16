import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { StoreContext } from './store';
import Map from './map/Map';

const Peripleo = () => {

  // Pre-selected record via hash URL
  const { recordId } = useParams();
  console.log('route:', recordId);

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