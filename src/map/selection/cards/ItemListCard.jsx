import React from 'react';
import { IoArrowBackOutline, IoCloseSharp } from 'react-icons/io5';
import { SiWikidata } from 'react-icons/si';
import { VscGlobe } from 'react-icons/vsc';
import { BiRightArrowAlt } from 'react-icons/bi';

import { SIGNATURE_COLOR } from '../../../Colors';

// Pre-set link icons
const ICONS = [
  [ 'www.wikidata.org', <SiWikidata /> ],
  [ 'www.geonames.org', <VscGlobe /> ],
  [ 'wikipedia.org', <img src="logos/en.wikipedia.org.png" /> ]
]

const placeholderIcon = host => {
  const initial = host.startsWith('www.') ?
    host.substring(4, 5) : host.substring(0, 1);

  return (
    <span className="p6o-link-placeholder">
      <span className="p6o-link-placeholder-inner">{initial.toUpperCase()}</span>
    </span>
  )
}

const InternalLink = props => {

  const { node } = props;

  return (
    <div onClick={() => props.onSelect(node)}>
      <div>
        <h3>{node.title}</h3>
        <h4>{node.dataset}</h4>
      </div>
      <BiRightArrowAlt />
    </div>
  )

}

const ExternalLink = props => {

  const link = props.node;

  const url = new URL(link.identifier);
  const { host, href } = url;

  const customIcon = props.config.link_icons &&
    Object.entries(props.config.link_icons).find(t => host.includes(t[0]));

  const icon  = customIcon ?
    <img src={customIcon[1]} /> :

    (() => {
      const builtInIcon = ICONS.find(t => host.includes(t[0]));
      return builtInIcon ?
        builtInIcon[1] : placeholderIcon(host);
    })();

  return (
    <>
      {icon}
      <a href={href} target="_blank" title={host}>{host}</a>
    </>
  )

}

const ItemListCard = props => {

  // Temporary hack!
  const color = SIGNATURE_COLOR[3]; 

  return (
    <div className="p6o-selection-card p6o-selection-itemlistcard">
      <header 
        style={{ backgroundColor: color }}>
        
        <button 
          aria-label="Go Back"
          onClick={props.onGoBack}>
          <IoArrowBackOutline />
        </button>
        
        <button
          aria-label="Close" 
          onClick={props.onClose}>
          <IoCloseSharp />
        </button>
      </header>
      <ul>
      {props.data.map(selection => selection.node.properties ?
        <li 
          key={selection.node.identifier}
          className="p6o-link-internal">
            <InternalLink 
              {...selection } 
              onSelect={node => props.onGoTo(node)} /> 
        </li> :

        <li
          key={selection.node.identifier}
          className="p6o-link-external">
          <ExternalLink  {...selection } />
        </li>
      )}
      </ul>
    </div>
  )

}

export default ItemListCard;