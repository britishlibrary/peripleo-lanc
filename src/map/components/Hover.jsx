import React from 'react';

const OFFSET = [15, 15];

const Hover = props => {

  const { node } = props;

  return (
    <div
      className="p6o-map-hover"
      style={{ left: props.x + OFFSET[0], top: props.y + OFFSET[1]}}>
      {node.title}
    </div> 
  )

}

export default Hover;