import React, { useContext } from 'react';
import { Popup } from 'react-map-gl';
import { HiExternalLink } from 'react-icons/hi';
import { MdOutlineRadar } from 'react-icons/md';
import { BiHourglass, BiNetworkChart } from 'react-icons/bi';
import { SiWikidata } from 'react-icons/si';
import { VscGlobe } from 'react-icons/vsc';

import { StoreContext } from '../../store';
import { SIGNATURE_COLOR } from '../../Colors';

// Pre-set link icons
const ICONS = {
  'www.wikidata.org': <SiWikidata />,
  'www.geonames.org': <VscGlobe />
}

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
      node.depictions[0]['@id'];
    }
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

const isString = val => typeof val === 'string' || val instanceof String;

const placeholderIcon = host => {
  const initial = host.startsWith('www.') ?
    host.substring(4, 5) : host.substring(0, 1);

  return (
    <span className="p6o-link-placeholder">{initial.toUpperCase()}</span>
  )
}

const formatLink = (link, optIcons) => {
  const icons = optIcons ? {
    ...ICONS, ...optIcons
  } :  ICONS;

  const url = new URL(link.identifier);

  const { host, href } = url;
  
  const icon = icons[host] && isString(icons[host]) ?
    <img src={icons[host]} /> : icons[host]; // null or JSX

  return (
    <a 
      href={href} 
      target="_blank"
      title={host}>
      {icon ? React.cloneElement(icon, { title: host }) : placeholderIcon(host)}
    </a>
  )
}

const SelectionPreview = props => {

  console.log(props);

  const { store } = useContext(StoreContext);
  
  const { node, feature, config } = props;

  const dataset = props.config.data.find(d => d.name === node.dataset);
  const { logo } = dataset;
    
  const { coordinates } = (node.geometry || feature.geometry);

  const image = getImage(node);

  const when = node.properties?.when;

  const url = node.properties?.url || node.properties?.resource_url || node.id;

  const connected = store.getConnectedNodes(node.id);

  const links = store.getExternalLinks(node.id);
  links.sort((a, b) => (b.identifier > a.identifier) ? 1 : -1);

  // Temporary hack!
  const color = SIGNATURE_COLOR[3]; 
   
  return (
    <Popup
      anchor="bottom"
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

              <ul className="p6o-selection-external-links">
                {links.map(l =>
                  <li key={l.identifier}>{formatLink(l, config.link_icons)}</li>
                )}
              </ul>

              {/* <MdOutlineRadar /> 21 Nearby <BiNetworkChart /> 2 Connected */}
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
    </Popup>
  )

}

export default SelectionPreview;