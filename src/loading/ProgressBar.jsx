import React from 'react';

const ProgressBar = props => {

  return (
    <div className="p6o-load-progress-outer">
      <div
        className="p6o-load-progress-inner" 
        style={{ width: props.progress ? `${props.progress * 100}%` : '0' }}/>
    </div>
  )

}

export default ProgressBar;