import React from 'react';
import ReactDOM from 'react-dom';

import HUD from '../src/hud/HUD';

import './index.scss';

const App = () => {

  return (
    <HUD />
  )

}

window.onload = function() {

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
    
}