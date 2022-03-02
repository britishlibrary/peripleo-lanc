import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import HUD from '../src/hud/HUD';

import  { mockResults } from './MockSearchResults';

import './index.scss';

const App = () => {

  const [ query, setQuery ] = useState('');

  return (
    <HUD 
      searchQuery={query}
      searchResults={mockResults}
      onChangeSearchQuery={setQuery} />
  )

}

window.onload = function() {

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
    
}