import React from 'react';
import ReactDOM from 'react-dom';

const Welcome = props => {

  return ReactDOM.createPortal(
    <div className="p6o-welcome-wrapper">
      <div className="p6o-welcome">
        Welcome to Peripleo

        <button onClick={props.onTakeTour}>
          Yes, take the tour
        </button>
      </div>
    </div>,

    document.body
  );

}

export default Welcome;