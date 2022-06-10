import React, { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoArrowBackOutline, IoCloseSharp } from 'react-icons/io5';
import { SiWikidata } from 'react-icons/si';
import { VscGlobe } from 'react-icons/vsc';
import { BiRightArrowAlt } from 'react-icons/bi';
import { HiPlus, HiMinus } from 'react-icons/hi';

import GoogleAnalytics from '../../../state/GoogleAnalytics';

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

    const matchingPattern = patterns.find(p => id.includes(p.pattern));
    if (matchingPattern)
      grouped[matchingPattern.label] = grouped[matchingPattern.label] || [];
    else
      grouped['__ungrouped'] = grouped['__ungrouped'] || [];

    grouped[matchingPattern ? matchingPattern.label : '__ungrouped'].push(obj);
  });

  // Sort according to pattern order
  const unsorted = Object.entries(grouped);

  const labelOrder = patterns.reduce((labels, pattern) =>
    labels.indexOf(pattern.label) === -1 ?
      [ ...labels, pattern.label ] : labels, []);

  const sorted = labelOrder.reduce((groups, label) => {
    const group = unsorted.find(t => t[0] === label);
    if (group) 
      groups.push(group);

    return groups;
  }, []);

  return grouped['__ungrouped'] ?
    [ ...sorted, ['__ungrouped', grouped['__ungrouped']] ] : 
    sorted;
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

const getLinkMeta = (node, config) => {
  const url = new URL(sanitizeURL(node.identifier));
  const { host, href } = url;

  const customIcon = config.link_icons &&
    Object.entries(config.link_icons).find(t => node.identifier.includes(t[0]));

  const icon = customIcon ?
    <img src={customIcon[1]} /> :

    (() => {
      const builtInIcon = ICONS.find(t => host.includes(t[0]));
      return builtInIcon ?
        builtInIcon[1] : placeholderIcon(host);
    })();

  return { icon, host, href };
}

const ExternalLink = props => {

  const link = props.node;
  const { icon, host, href } = getLinkMeta(props.node, props.config);

  return (
    <>
      {props.icon && <div className="p6o-link-icon">{icon}</div> }
      <div className="p6o-external-link-meta">
        {link.label && 
          <a 
            className="p6o-external-link-label" 
            onClick={() => GoogleAnalytics.ttagNavigation(href)}
            href={href} 
            target="_blank" 
            title={link.label}>{link.label}</a>
        }

        <a 
          className="p6o-external-link-host" 
          onClick={() => GoogleAnalytics.ttagNavigation(href)}
          href={href} 
          target="_blank" 
          title={link.label || host}>{host}</a>
      </div>
    </>
  )

}

const LinkGroup = props => {

  const [isOpen, setOpen] = useState(props.open);

  const { config } = props.nodes[0];

  const customIcon = config.link_icons?.find(p => props.label == p.label);

  const icon = customIcon && <img src={customIcon.img} />;

  const onToggle = () => setOpen(!isOpen);

  return (
    <li className={isOpen ? "p6o-link-group open" : "p6o-link-group closed"}>
      <h2 onClick={onToggle}>
        {props.label !== '__ungrouped' && <div className="p6o-link-icon">{icon}</div> }

        {props.label === '__ungrouped' ?
          <div className="p6o-link-group-label">Other ({props.nodes.length})</div> :
          <div className="p6o-link-group-label">{props.label} ({props.nodes.length})</div>
        }
        
        <button 
          className="p6o-link-group-toggle">
          {isOpen ? <HiMinus /> : <HiPlus />}
        </button>
      </h2>

      {isOpen &&
        <ul>
          {props.nodes.map(selection => selection.node.properties ?
            <li 
              key={selection.node.id || selection.node.identifier}
              className="p6o-link p6o-link-internal">
                <InternalLink 
                  {...selection } 
                  onSelect={node => props.onGoTo(node)} /> 
            </li> :

            <li
              key={selection.node.id || selection.node.identifier}
              className="p6o-link p6o-link-external">
              <ExternalLink  {...selection } />
            </li>
          )}
        </ul>
      }
    </li>
  )

}

const ItemListCard = props => {

  const { referrer } = props;

  const config = props.nodeList[0].config;

  // Temporary hack!
  const color = SIGNATURE_COLOR[3]; 

  const grouped = config.link_icons ? 
    groupByIdPattern(props.nodeList, config.link_icons) : null;

  return (
    <div className="p6o-selection-card p6o-selection-itemlistcard">
      <header 
        style={{ backgroundColor: color }}>
        
        {referrer &&
          <button 
            aria-label="Go Back"
            onClick={props.onGoBack}>
            <IoArrowBackOutline />
          </button>
        }

        {referrer && 
          <h1>Related to: {referrer.node.title}</h1>
        }
        
        <button
          aria-label="Close" 
          onClick={props.onClose}>
          <IoCloseSharp />
        </button>
      </header>
      {config.link_icons ?
        <ul className="p6o-link-groups-container">
          {grouped.map(([label, nodes]) => 
            <LinkGroup 
              key={label} 
              open={grouped.length == 1}
              label={label} 
              nodes={nodes} 
              onGoTo={props.onGoTo} />
          )}
        </ul>
       
        :

        <ul>
          {props.nodeList.map(selection => selection.node.properties ?
            <li 
              key={selection.node.identifier}
              className="p6o-link-internal p6o-link">
                <InternalLink 
                  {...selection } 
                  onSelect={node => props.onGoTo(node)} /> 
            </li> :

            <li
              key={selection.node.identifier}
              className="p6o-link-external p6o-link">
              <ExternalLink  {...selection } />
            </li>
          )}
        </ul>
      }
      <footer aria-live={true}>
        <AiOutlineInfoCircle />Links open a new tab
      </footer>
    </div>
  )

}

export default ItemListCard;