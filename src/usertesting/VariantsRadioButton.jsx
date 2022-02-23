import React from 'react';

const VariantsRadioButton = props => {

  const toVal = label => label.toUpperCase().replaceAll(' ', '_');

  const variant = label => (
    <div 
      key={label}
      className={props.selected === toVal(label) ? 'variant selected' : 'variant'}
      onClick={() => props.onSelect(toVal(label))}>
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