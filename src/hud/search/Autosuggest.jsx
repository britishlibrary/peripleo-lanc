import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import useClickOutside from '../../useClickoutside';
import { StoreContext } from '../../store/StoreContext';

const Autosuggest = props => {
  
  const el = useRef();

  const { store } = useContext(StoreContext);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const [ query, setQuery ] = useState(props.search?.query || '');
  const [ debouncedQuery ] = useDebounce(query, 250);

  useClickOutside(el, () => 
    setTimeout(() => setSuggestions([]), 200));

  useEffect(() => {
    if (el.current)
      el.current.querySelector('input').focus();
  }, [ el.current ]);

  useEffect(() => {
    if (debouncedQuery) {
      setSelectedSuggestion(null);

      const suggestions = store.suggest(debouncedQuery);
      setSuggestions(suggestions.filter(s => s !== debouncedQuery));
    } else {
      setSuggestions([]);
    }

    props.onChange(debouncedQuery);
  }, [ debouncedQuery ]);

  const onChange = evt => {
    const { value } = evt.target;
    setQuery(value);
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
      if (selectedSuggestion) {
        setQuery(selectedSuggestion);
      } else if (suggestions.length > 0) {
        setQuery(suggestions[0]);
      }
    }
  }

  const onClick = suggestion => {
    setQuery(suggestion);
    setSuggestions([]);
    props.onEnter();
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
          onChange={onChange} />
      </div>

      <div className="p6o-search-autosuggest">
        {suggestions.length > 0 &&
          <ul>
            {suggestions.map(suggestion =>
              <li
                key={suggestion}
                onClick={() => onClick(suggestion)}
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