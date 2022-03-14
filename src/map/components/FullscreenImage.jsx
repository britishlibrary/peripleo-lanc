import React from 'react';
import Lightbox from 'react-image-lightbox';

const FullscreenImage = props => {

  return (
    <Lightbox 
      mainSrc={props.src}
      onCloseRequest={props.onClose} />
  )

}

export default FullscreenImage;