import React from 'react';
import ReactDOM from 'react-dom';

const Welcome = props => {

  return ReactDOM.createPortal(
    <div className="p6o-welcome-wrapper">
      <div className="p6o-welcome">
        <h1>
          Locating a National Collection
        </h1>

        <p>
          Welcome to the visualization prototype for the 
          Locating a National Collection project. 
          To learn more, take the tour.
        </p>
        
        <div className="p6o-welcome-buttons">
          <button 
            className="p6o-no-thanks"
            onClick={props.onNoThanks}>
            No thanks
          </button>

          <button 
            className="p6o-take-tour"
            onClick={props.onTakeTour}>
            Yes, take the tour
          </button>
        </div>
      </div>
    </div>,

    document.body
  );

}

export default Welcome;