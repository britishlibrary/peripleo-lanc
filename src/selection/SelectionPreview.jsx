import React from 'react';
import Draggable from 'react-draggable';

import { SIGNATURE_COLOR } from '../Colors';

const SelectionPreview = props => {

  const { selection } = props;

  const image = selection.depictions?.length > 0 &&
    selection.depictions[0]['@id']; 

  console.log(selection);

  return (
    <Draggable
      handle=".p6o-selection-drag-handle">

      <div className="p6o-selection">
        <div 
          className="p6o-selection-drag-handle" 
          style={{ backgroundColor: SIGNATURE_COLOR[1]}} />

        {image && 
          <div 
            className="p6o-selection-header-image"
            style={{ backgroundImage: `url('${image}')` }}>
          </div>
        }

        {selection.properties.description &&
          <p className="p6o-selection-description">
            {selection.properties.description}
          </p>
        }
      </div>
    </Draggable>
  )

}

export default SelectionPreview;