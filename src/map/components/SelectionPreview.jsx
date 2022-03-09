import React from 'react';
import { Popup } from 'react-map-gl';
import { HiExternalLink } from 'react-icons/hi';
import { MdOutlineRadar } from 'react-icons/md';
import { BiNetworkChart } from 'react-icons/bi';

import { SIGNATURE_COLOR } from '../../Colors';

// TODO IIIF
const getImage = node => {
  if (node.depictions?.length > 0) {
    // Temporary hack!
    const nonIIIF = node.depictions.filter(d => !d.selector);    
    if (nonIIIF.length > 0)
      return nonIIIF[0]['@id']; 
  }
}

const getTypes = node => {
  if (node.properties.type)
    return [ node.properties.type ];
  else if (node.types?.length > 0)
    return node.types.map(t => t.label);
  else
    return [];
}

const SelectionPreview = props => {
  
  console.log(props);

  const { node } = props;

  const dataset = props.config.data.find(d => d.name === node.dataset);
  const { logo } = dataset;
    
  const { coordinates } = node.geometry;

  const image = getImage(node);

  const color = SIGNATURE_COLOR[3]; 
   
  return (
    <Popup
      longitude={coordinates[0]} 
      latitude={coordinates[1]}
      maxWidth={440}
      closeButton={false}
      closeOnClick={false}>

      <div className="p6o-selection"
        style={{ backgroundColor: color }}>

        <div className="p6o-selection-content">
          {image &&
            <div 
              className="p6o-selection-header-image"
              style={{ backgroundImage: `url("${image}")` }}>    
            </div> 
          }

          <main>
            <h1>{node.title}</h1>
            <h2 className="p6o-selection-source-link">
              <HiExternalLink /> 
              <a href="">{node.dataset}</a>
            </h2>
                
            <ul className="p6o-selection-types">
              {getTypes(node).map(t => <li key={t}>{t}</li>)}
            </ul>
            
            {node.properties.description &&
              <p className="p6o-selection-description">
                {node.properties.description}
              </p>
            }
          </main>

          <footer>
            <MdOutlineRadar /> 21 Nearby <BiNetworkChart /> 2 Connected
          </footer>
        </div>
      </div>
    </Popup>
  )

}

export default SelectionPreview;