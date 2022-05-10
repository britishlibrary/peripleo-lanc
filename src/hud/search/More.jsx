import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';

import { formatNumber } from './Facets';

import { SIGNATURE_COLOR } from '../../Colors';

const More = props => {

  const currentFacetFilter = props.search.filters.find(f => f.facet === props.search.facet);

  const [selectedFilters, setSelectedFilters] = useState(currentFacetFilter?.values || []);

  const counts = props.search.facetDistribution?.counts || [];

  const onToggleFilter = label => () => {
    if (selectedFilters.includes(label))
      setSelectedFilters(selectedFilters.filter(f => f !== label));
    else
      setSelectedFilters([...selectedFilters, label]);
  }

  return ReactDOM.createPortal(
    <div className="p6o-facets-container p6o-more-facet-values-container">
      <div className="p6o-facets">
        <h1>{props.search.facet}</h1>

        <div className="p6o-more-facet-values-buttons">
          <button 
            className="p6o-more-facet-values-set"
            onClick={() => props.onSet(selectedFilters)}>
            Set Filters <IoCheckmarkOutline />
          </button>

          <button
            className="p6o-more-facet-values-set"
            onClick={props.onCancel}>
            Cancel <IoCloseOutline />
          </button>
        </div>
        <ul>
          {counts.map(([label, count], idx) => 
            <li 
              key={label + idx}
              onClick={onToggleFilter(label)}>
              <div className="p6o-facet-value-wrapper">
                <span 
                  className="p6o-facet-value-count"
                  style={{ 
                    backgroundColor: selectedFilters.includes(label) ? 
                      SIGNATURE_COLOR[selectedFilters.indexOf(label) % SIGNATURE_COLOR.length] : '#7a7a7a'  
                  }}>{formatNumber(count)}</span>

                <span className="p6o-facet-value-label">{label}</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>, 

    document.body
  )

}

export default More;