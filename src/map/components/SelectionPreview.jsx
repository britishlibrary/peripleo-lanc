import React from 'react';
import { Popup } from 'react-map-gl';

import { SIGNATURE_COLOR } from '../../Colors';

const SelectionPreview = props => {
  
  console.log(props);

  const { selection } = props;

  const datasets = props.config.data.map(d => d.name);
  const idx = datasets.indexOf(selection.dataset)

  const backgroundColor = SIGNATURE_COLOR[idx];
    
  const { coordinates } = selection.geometry;

  let image = null;
  if (selection.depictions?.length > 0) {
    // Temporary hack!
    const nonIIIF = selection.depictions.filter(d => !d.selector);    
    if (nonIIIF.length > 0)
      image = nonIIIF[0]['@id']; 
  }
   
  return (
    <Popup
      longitude={coordinates[0]} 
      latitude={coordinates[1]}
      maxWidth={440}
      closeButton={false}
      closeOnClick={false}>

      <div className="p6o-selection">
        {image ?
          <>
            <div 
              className="p6o-selection-header-image"
              style={{ backgroundImage: `url('${image}')` }}>
              
              <h1>{selection.title}</h1>
            </div> 
            
            {selection.properties.description &&
              <p className="p6o-selection-description">
                {selection.properties.description}
              </p>
            }
          </> :

          <>
            <div className="p6o-selection-header-noimage">
              <h1>{selection.title}</h1>
            </div>
            <p className="p6o-selection-description">
              {selection.properties.description}
            </p>
          </>
        }

        <div 
          className="p6o-selection-source" 
          style={{ backgroundColor }}>
          <p>
            <a href={selection.id} target="_blank">Visit Source</a>
          </p>
          <p>
            {selection.dataset}
          </p>
        </div>
      </div>
    </Popup>
  )

}

export default SelectionPreview;