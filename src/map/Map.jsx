import React from 'react';
import ReactMapGL from 'react-map-gl';

// import { StoreContext } from '../store/StoreContext';

const GB_BOUNDS = [-7.9, 49.5, 2.2, 59.4];

const Map = props => {

  // const { store } = useContext(StoreContext);

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${props.config.api_key}`

  return (  
    <div className="p6o-map-container">
      <ReactMapGL
        initialViewState={{
          bounds: GB_BOUNDS
        }}
        height="100vh"
        mapStyle={style}>

      </ReactMapGL>
    </div>
  )

}

export default Map;