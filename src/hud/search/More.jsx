import React from 'react';
import ReactDOM from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';

import { formatNumber } from './Facets';

const More = props => {

  const counts = props.search.facetDistribution?.counts || [];

  return ReactDOM.createPortal(
    <div className="p6o-facets-container p6o-more-facet-values-container">
      <div className="p6o-facets">
        <h1>{props.search.facet}</h1>
        <button onClick={props.onClose}>
          <IoCloseOutline />
        </button>
        <ul>
          {counts.map(([label, count], idx) => 
            <li 
              key={label + idx}>
              <div className="p6o-facet-value-wrapper">
                <span 
                  className="p6o-facet-value-count"
                  style={{ 
                    backgroundColor: '#7a7a7a' 
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