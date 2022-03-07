import React from 'react';

const OFFSET = [15, 15];

const Hover = props => {
  
  const { node, feature } = props;

  const style = {
    left: props.x + OFFSET[0], 
    top: props.y + OFFSET[1],
    borderWidth: !feature.properties.color && 0, 
    borderColor: feature.properties.color
  }

  return (
    <div
      className="p6o-map-hover"
      style={style}>
      {node.title}
    </div> 
  )

}

export default Hover;