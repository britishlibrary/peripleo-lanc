import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import useSearch from '../../state/search/useSearch';

const Filter = props => {

  return (
    <li className="p6o-hud-filter-group">
      <span>{props.facet} = {props.values.join(', ')}</span>
      <IoCloseOutline onClick={props.onClear} />
    </li>
  )

}

const Filters = () => {

  const { search, clearFilter } = useSearch();

  const onClear = filterFacet => () =>
    clearFilter(filterFacet);

  return (
    <div className="p6o-hud-filters-container">
      <ul>
        {search.filters.map(filter =>
          <Filter 
            key={filter.facet}
            onClear={onClear(filter.facet)}
            {...filter} />
        )}
      </ul>
    </div>
  )

}

export default Filters;