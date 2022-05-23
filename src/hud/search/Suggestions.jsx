import React, { useContext, useEffect, useState } from 'react';

import { StoreContext } from '../../store/StoreContext';

const AutoSuggest = props => {

  const { store } = useContext(StoreContext);

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (props.query) {
      const suggestions = store.suggest(props.query);
      setSuggestions(suggestions);
    }
  }, [props.query]);

  return (
    <div className="p6o-search-autosuggest">
      {suggestions.length > 0 &&
        <ul>
          {suggestions.map(suggestion =>
            <li key={suggestion}>
              {suggestion}
            </li>
          )}
        </ul>
      }
    </div>
  )

}

export default AutoSuggest;