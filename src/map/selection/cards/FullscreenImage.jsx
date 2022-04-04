import React from 'react';
import Lightbox from 'react-image-lightbox';

const FullscreenImage = props => {

  const { image } = props;

  return (
    <Lightbox 
      mainSrc={image.src}
      imageCaption={
        <div className="p6o-fullscreen-image-caption">
          <h1>
            {image.title} {image.accreditation && 
              <span>({image.accreditation})</span>
            } {image.license?.label && <span> - {image.license.label}</span>}
          </h1> 
        </div>
      }
      onCloseRequest={props.onClose} />
  )

}

export default FullscreenImage;