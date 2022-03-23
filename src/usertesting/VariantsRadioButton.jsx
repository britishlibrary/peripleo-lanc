import React from 'react';

import useSearch from '../state/search/useSearch';

const VariantsRadioButton = props => {

  const toVal = label => label.toUpperCase().replaceAll(' ', '_');

  const { 
    setCategoryFacet,
    availableFacets
  } = useSearch();

  const onSelect = label => () => {
    if (label === 'COLOURED_HEATMAP')
      setCategoryFacet(availableFacets[0]);

    props.onSelect(label);
  }

  const variant = label => (
    <div 
      key={label}
      className={props.selected === toVal(label) ? 'variant selected' : 'variant'}
      onClick={onSelect(toVal(label))}>
      {label}
    </div>
  );

  return (
    <div className="p6o-usertesting variants-container">
      {['Points', 'Clusters', 'Heatmap', 'Coloured Heatmap'].map(label =>
        variant(label)
      )}
    </div>
  )

}

export default VariantsRadioButton;