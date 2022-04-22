import React from 'react';
import ReactDOM from 'react-dom';

const Welcome = props => {

  return ReactDOM.createPortal(
    <div className="p6o-welcome-wrapper">
      <div className="p6o-welcome">
        <h1>Welcome!</h1>

        <p>
          Welcome to the map prototype for 
          the <strong>Locating a National Collection</strong> project. 
          Take the tour to learn about the main user interface elements.
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