import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { StoreContext } from '../../store/StoreContext';

const Autosuggest = props => {
  
  const el = useRef();

  const { store } = useContext(StoreContext);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const [ query, setQuery ] = useState(props.search?.query || '');
  const [ debouncedQuery ] = useDebounce(query, 250);

  useEffect(() => {
    if (el.current)
      el.current.querySelector('input').focus();
  }, [ el.current ]);

  useEffect(() => {
    if (debouncedQuery) {
      setSelectedSuggestion(null);

      const suggestions = store.suggest(debouncedQuery);
      setSuggestions(suggestions.filter(s => s !== debouncedQuery));

      props.onChange(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [ debouncedQuery ]);

  const onChange = evt => {
    const { value } = evt.target;   
    setQuery(value);
  }

  const onBlur = () => {
    setSuggestions([]);
    setSelectedSuggestion(null);
  }

  const selectSuggestion = inc => {
    if (selectSuggestion === null) {
      if (inc > 0) // Select first
        setSelectedSuggestion(suggestions[0]);
      else // Select last
        setSelectedSuggestion(suggestions.length - 1);
    } else {
      const currentIdx = suggestions.indexOf(selectedSuggestion);
      const updatedIdx = (currentIdx + inc + suggestions.length) % suggestions.length;
      setSelectedSuggestion(suggestions[updatedIdx]);
    }
  }

  const onKeyDown = evt => { 
    if (evt.code === 'Enter') {
      if (selectedSuggestion)
        setQuery(selectedSuggestion);

      setSuggestions([]);
      props.onEnter();
    } else if (evt.code === 'ArrowUp') {
      selectSuggestion(-1);
    } else if (evt.code === 'ArrowDown') {
      selectSuggestion(1);
    } else if (evt.code === 'Tab') {
      evt.preventDefault();
      if (selectedSuggestion)
        setQuery(selectedSuggestion);
    }
  }

  const emphasise = suggestion =>
    <span dangerouslySetInnerHTML={{ 
      __html: suggestion.replaceAll(debouncedQuery.toLowerCase(), `<em>${debouncedQuery}</em>`) 
    }}/>;

  return (
    <>
      <div ref={el} className="p6o-hud-searchinput">
        <input 
          tabIndex={2}
          placeholder="Search within dataset"
          aria-label="Search within dataset"
          value={query} 
          onKeyDown={onKeyDown}
          onChange={onChange} 
          onBlur={onBlur} />
      </div>

      <div className="p6o-search-autosuggest">
        {suggestions.length > 0 &&
          <ul>
            {suggestions.map(suggestion =>
              <li
                key={suggestion}
                className={selectedSuggestion === suggestion ? 'selected' : null}>
                {emphasise(suggestion)}
              </li>
            )}
          </ul>
        }
      </div>
    </>
  )

}

export default Autosuggest;