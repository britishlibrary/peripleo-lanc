import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoArrowBackOutline, IoCloseSharp } from 'react-icons/io5';
import { SiWikidata } from 'react-icons/si';
import { VscGlobe } from 'react-icons/vsc';
import { BiRightArrowAlt } from 'react-icons/bi';

import { getTypes } from './Utils';
import { SIGNATURE_COLOR } from '../../../Colors';

const sanitizeURL = str => /^http(s?):\/\//.test(str) ?
  str : 'http://' + str;

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

const groupByIdPattern = (nodeList, patterns) => {
  const grouped = {};

  nodeList.forEach(obj => {
    const id = obj.node.id || obj.node.identifier;

    const matchingPattern = patterns.find(pattern => id.includes(pattern));
    if (matchingPattern)
      grouped[matchingPattern] = grouped[matchingPattern] || [];
    else
      grouped['__ungrouped'] = grouped['__ungrouped'] || [];

    grouped[matchingPattern ? matchingPattern : '__ungrouped'].push(obj);
  });

  return Object.entries(grouped);
}

const InternalLink = props => {

  const { node } = props;

  let source;
  try {
    const url = new URL(sanitizeURL(node.id));
    source = url.host;
  } catch {
    source = node.dataset;
  }

  return (
    <div onClick={() => props.onSelect(node)}>
      <div className="p6o-internal-link-meta">
        <h3>{node.title}</h3>
        <h4>{source}</h4>
        <p className="p6o-node-types">
          {getTypes(node).join(', ')}
        </p>
      </div>
      <BiRightArrowAlt />
    </div>
  )

}

const ExternalLink = props => {

  const link = props.node;

  const url = new URL(sanitizeURL(link.identifier));
  const { host, href } = url;

  const customIcon = props.config.link_icons &&
    Object.entries(props.config.link_icons).find(t => link.identifier.includes(t[0]));

  const icon  = customIcon ?
    <img src={customIcon[1]} /> :

    (() => {
      const builtInIcon = ICONS.find(t => host.includes(t[0]));
      return builtInIcon ?
        builtInIcon[1] : placeholderIcon(host);
    })();

  return (
    <>
      <div className="p6o-external-link-icon">{icon}</div>
      <div className="p6o-external-link-meta">
        {link.label && 
          <a 
            className="p6o-external-link-label" 
            href={href} 
            target="_blank" 
            title={link.label}>{link.label}</a>
        }

        <a 
          className="p6o-external-link-host" 
          href={href} 
          target="_blank" 
          title={link.label || host}>{host}</a>
      </div>
    </>
  )

}

const LinkGroup = props => {

  return (
    <li>
      <h2>{props.pattern}</h2>
      <ul>
        {props.nodes.map(selection => selection.node.properties ?
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
    </li>
  )

}

const ItemListCard = props => {

  const { referrer } = props;

  const config = props.nodeList[0].config;

  // Temporary hack!
  const color = SIGNATURE_COLOR[3]; 

  const grouped = groupByIdPattern(props.nodeList, Object.keys(config.link_icons));

  return (
    <div className="p6o-selection-card p6o-selection-itemlistcard">
      <header 
        style={{ backgroundColor: color }}>
        
        <button 
          aria-label="Go Back"
          onClick={props.onGoBack}>
          <IoArrowBackOutline />
        </button>

        {referrer && 
          <h1>{referrer.node.title}</h1>
        }
        
        <button
          aria-label="Close" 
          onClick={props.onClose}>
          <IoCloseSharp />
        </button>
      </header>
      <ul>
        {grouped.map(([pattern, nodes]) => 
          <LinkGroup key={pattern} pattern={pattern} nodes={nodes} />
        )}
      </ul>
      <footer aria-live={true}>
        <AiOutlineInfoCircle />Links open a new tab
      </footer>
    </div>
  )

}

export default ItemListCard;

/*
      {props.nodeList.map(selection => selection.node.properties ?
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
*/