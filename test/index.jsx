import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import HUD from '../src/hud/HUD';

import './index.scss';

const DUMMY_RESULTS = [
  { title: 'Record #1' }
];

const App = () => {

  const [ query, setQuery ] = useState('');

  const [ results, setResults ] = useState(DUMMY_RESULTS);

  // For testing: set results as soon as there is a query
  useEffect(() => {
    if (query)
      setResults(DUMMY_RESULTS);
  }, [query]);

  return (
    <HUD 
      searchQuery={query}
      searchResults={results}
      onChangeSearchQuery={setQuery} />
  )

}

window.onload = function() {

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
    
}