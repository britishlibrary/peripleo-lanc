import React, { useEffect, useState } from 'react';

import Map from './map/Map';

const Peripleo = () => {

  const [ config, setConfig ] = useState();

  useEffect(() => {
    fetch('peripleo.config.json')
      .then(response => response.json())
      .then(setConfig)
      .catch(error => {
        // TODO error
        console.error('Error loading Peripleo config. Please add a valid `peripleo.config.json` to your application root.');
      });
  }, []);

  // TODO LOADING screen
  return (
    <>
      {config && <Map config={config} /> }
    </>
  )

}

export default Peripleo;