import React, { useContext, useState } from 'react';
import ReactMapGL from 'react-map-gl';

// import { StoreContext } from '../store/StoreContext';

const Map = props => {

  // const { store } = useContext(StoreContext);

  const [ viewport, setViewport ] = useState({
    latitude: 46.2,
    longitude: 16.4,
    zoom: 4,
    width: window.innerWidth,
    height: window.innerHeight
  });

  const style = 'https://api.maptiler.com/maps/outdoor/style.json?key=FZebSVZUiIemGD0m8ayh'

  return (  
    <div className="p6o-container">
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle={style}
        onViewportChange={setViewport}>

      </ReactMapGL>
    </div>
  )

}

export default Map;