import React, { useEffect, useState } from 'react';
import { ImFilter } from 'react-icons/im';
import { IoTriangle } from 'react-icons/io5';
import { useDebounce } from 'use-debounce';

import useSearch from '../state/search/useSearch';

const MobileHUD = props => {

  const { 
    search,
    changeSearchQuery,
    fitMap
  } = useSearch();

  const [ query, setQuery ] = useState(search?.query || '');
  const [ debouncedQuery ] = useDebounce(query, 250);

  useEffect(() => {
    changeSearchQuery(debouncedQuery);
  }, [ debouncedQuery ]);

  const onChange = evt =>
    setQuery(evt.target.value);

  const onKeyDown = evt => { 
    if (evt.code === 'Enter')
     fitMap();
  }

  return (
    <div className="p6o-mobile-hud">
      <button className="p6o-mobile-hud-filter-toggle">
        <ImFilter className="p6o-mobile-hud-filter-toggle-icon" />
        <IoTriangle className="p6o-mobile-hud-filter-toggle-arrow" />
      </button>

      <div className="p6o-mobile-hud-searchinput">
        <input 
          placeholder="Enter your search"
          aria-label="Enter search"
          value={query} 
          onKeyDown={onKeyDown}
          onChange={onChange} />
      </div>
    </div>
  )

}

export default MobileHUD;