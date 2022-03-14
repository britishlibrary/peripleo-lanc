import React, { useContext, useState } from 'react';
import { Popup } from 'react-map-gl';
import { HiExternalLink } from 'react-icons/hi';
import { BiHourglass } from 'react-icons/bi';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { SiWikidata } from 'react-icons/si';
import { VscGlobe } from 'react-icons/vsc';

import { StoreContext } from '../../store';
import { SIGNATURE_COLOR } from '../../Colors';

import FullscreenImage from './FullscreenImage';

// Pre-set link icons
const ICONS = [
  [ 'www.wikidata.org', <SiWikidata /> ],
  [ 'www.geonames.org', <VscGlobe /> ],
  [ 'wikipedia.org', <img src="logos/en.wikipedia.org.png" /> ]
]

const getImage = node => {
  if (node.depictions?.length > 0) {
    // Temporary hack!
    const iiif = node.depictions.filter(d => d.selector);
    if (iiif.length > 0) {
      const d = node.depictions[0];
      const baseUrl = d['@id'].substring(0, d['@id'].lastIndexOf('/'));
      const coordinates = d.selector[0].value.substring(d.selector[0].value.indexOf('pixel:') + 6);
      return `${baseUrl}/${coordinates}/max/0/default.jpg`;
    } else {   
      return node.depictions[0]['@id'];
    }
  } 
}

const getTypes = node => {
  if (node.types?.length > 0)
    return node.types.map(t => t.label);
  else if (node.properties.type)
    return [ node.properties.type ];
  else if (node.types?.length > 0)
    return node.types.map(t => t.label);
  else
    return [];
}

const isString = val => typeof val === 'string' || val instanceof String;

const placeholderIcon = host => {
  const initial = host.startsWith('www.') ?
    host.substring(4, 5) : host.substring(0, 1);

  return (
    <span className="p6o-link-placeholder">{initial.toUpperCase()}</span>
  )
}

const formatLinks = (links, optIcons) => {

  const customIcons = optIcons ? 
    Object.entries(optIcons) : [];

  const linksWithIcons = links.map(link => {
    const url = new URL(link.identifier);

    const { host, href } = url;

    const customIcon = customIcons.find(t => host.includes(t[0]));

    if (customIcon) {
      // Custom icon - img element, priority 1
      return { href, host, icon: <img src={customIcon[1]} />, priority: 1 };
    } else {
      const builtInIcon = ICONS.find(t => host.includes(t[0]));
      if (builtInIcon) {
        // Built-in icon: Wikipedia before others
        const priority =  builtInIcon[0] === 'wikipedia.org' ? 2 : 3;
        return { href, host, icon: builtInIcon[1], priority };
      } else {
        // Default: placeholder
        return { href, host, icon: placeholderIcon(host), priority: 4 };
      }
    } 
  });

  linksWithIcons.sort((a, b) => 
    a.priority === b.priority ?
      (a.href > b.href ? 1 : -1) :
      a.priority - b.priority);

  return linksWithIcons.map(({ href, host, icon }) => 
    <li key={href}>
      <a href={href} target="_blank" title={host}>
        {React.cloneElement(icon, { title:host })}
      </a>
    </li>
  );
}

const SelectionPreview = props => {

  console.log(props);

  const [ showFullscreenImage, setShowFullscreenImage ] = useState(false);

  const { store } = useContext(StoreContext);
  
  const { node, feature, config } = props;

  const dataset = props.config.data.find(d => d.name === node.dataset);
  const { logo } = dataset;
    
  const { coordinates } = (node.geometry || feature.geometry);

  const image = getImage(node);

  const when = node.properties?.when;

  const url = node.properties?.url || node.properties?.resource_url || node.id;

  const links = formatLinks(store.getExternalLinks(node.id), config.link_icons);

  // Temporary hack!
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

              <button 
                className="p6o-selection-header-image-btn-full"
                onClick={() => setShowFullscreenImage(true) }>
                <BsArrowsFullscreen />
              </button>
            </div> 
          }

          <main>
            <div className="p6o-selection-main-fixed">
              <h1>{node.title}</h1>
              {when && 
                <h2>
                  <BiHourglass /> {when}
                </h2>
              }
                  
              <ul className="p6o-selection-types">
                {getTypes(node).map(t => <li key={t}>{t}</li>)}
              </ul>
            </div>
            
            <div className="p6o-selection-main-flex">
              {node.properties.description &&
                <p className="p6o-selection-description">
                  {node.properties.description}
                </p>
              }

              {links.length > 0 &&
                <div className="p6o-selection-external-links">
                  <h3>Links to External Resources:</h3>
                  <ul>
                    {links}
                  </ul>
                </div>
              }
            </div>
          </main>

          <footer>
            <div className="p6o-selection-view-source">
              <a 
                href={url} 
                target="_blank" 
                className="p6o-selection-view-source-top">
                <HiExternalLink /> View source record
              </a>

              <a
                href={url} 
                target="_blank" 
                className="p6o-selection-view-source-bottom">{node.dataset}</a>
            </div>

            <img src={logo} /> 
          </footer>
        </div>
      </div>

      {showFullscreenImage && 
        <FullscreenImage src={image} onClose={() => setShowFullscreenImage(false)} />
      }
    </Popup>
  )

}

export default SelectionPreview;