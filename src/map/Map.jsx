import React from 'react';
import ReactMapGL from 'react-map-gl';

const Map = props => {

  const { config } = props;

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`

  return (  
    <div className="p6o-map-container">
      <ReactMapGL
        initialViewState={{
          bounds: config.initial_bounds
        }}
        height="100vh"
        mapStyle={style}>

      </ReactMapGL>
    </div>
  )

}

export default Map;