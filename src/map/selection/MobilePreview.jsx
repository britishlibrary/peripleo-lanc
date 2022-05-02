import React from 'react';
import ReactDOM from 'react-dom';

const MobilePreview = props => {
  
  return ReactDOM.createPortal(
    <div className="p6o-mobile-selection-preview">
      {props.children}
    </div>,

    document.body
  )

}

export default MobilePreview;