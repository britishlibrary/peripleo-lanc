import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { StoreContext } from './store';

import HUD from './hud/HUD';
import Map from './map/Map';

const Peripleo = () => {

  // Pre-selected record via hash URL
  const { recordId } = useParams();

  const { store } = useContext(StoreContext);

  const [ config, setConfig ] = useState();

  const [ isDataLoaded, setIsDataLoaded ] = useState(false);

  const [ searchQuery, setSearchQuery ] = useState();

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

  useEffect(() => {
    // TODO
    console.log('query: ' + searchQuery);
  }, [searchQuery]);

  // TODO LOADING screen
  return config ? 
    <>
      <Map 
        config={config} 
        loaded={isDataLoaded} />

      <HUD 
        config={config}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery} />
    </> :

    <div>LOADING</div>

}

export default Peripleo;