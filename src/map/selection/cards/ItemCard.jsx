import React, { useContext, useEffect, useRef, useState } from 'react';
import { BiLink } from 'react-icons/bi';
import { IoArrowBackOutline, IoCloseSharp } from 'react-icons/io5';
import { RiExternalLinkLine } from 'react-icons/ri';
import { CgArrowsExpandRight } from 'react-icons/cg';
import * as sanitize from 'sanitize-html';

import { SIGNATURE_COLOR } from '../../../Colors';

import GoogleAnalytics from '../../../state/GoogleAnalytics';

import { StoreContext } from '../../../store';
import { parseWhen } from './When';
import { getDescriptions } from '../../../store';
import { getPreviewImage, getTypes } from './Utils';
import useSearch from '../../../state/search/useSearch';

import FullscreenImage from './FullscreenImage';

const highlight = (text, query) => {
  if (!query)
    return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, idx) => part.toLowerCase() === query.toLowerCase() ? `<mark>${part}</mark>` : part).join('');
}

const ItemCard = props => {
  const el = useRef();

  const { search } = useSearch();

  const { store } = useContext(StoreContext);

  const [ showLightbox, setShowLightbox ] = useState(false);

  const { node } = props;

  useEffect(() => {
    if (el.current) {
      el.current.querySelector('header button').blur();
    }
  }, [ el.current ]);

  const image = getPreviewImage(node);

  const descriptions = getDescriptions(node);

  const sourceUrl = 
    node.properties?.url || node?.identifier || node.id;

  const when = parseWhen(node.properties?.when || node.when);

  const connectedNodes = store.getConnectedNodes(node.id);

  const blockList = props.config.link_icons?.filter(p => !p.img).map(p => p.pattern);

  const externalLinks = blockList ? 
    store.getExternalLinks(node.id).filter(l => {
      const id = l.identifier || l.id;
      return !blockList.find(pattern => id.includes(pattern));
    }) : store.getExternalLinks(node.id);

  // Related items includes external + internal links!
  const connected = [
    ...connectedNodes,
    ...externalLinks
  ];

  const goTo = () => props.onGoTo({
    referrer: props,
    nodeList: connected
  });
  
  const tagNav = () => 
    GoogleAnalytics.tagNavigation(sourceUrl);

  // Temporary hack!
  const color = SIGNATURE_COLOR[3]; 

  return (
    <div 
      ref={el}
      className="p6o-selection-card p6o-selection-itemcard">
      <header 
        aria-disabled
        style={{ 
          backgroundColor: color,
          justifyContent: props.backButton ? 'space-between' : 'flex-end'
        }}>
        
        {props.backButton && 
          <button
            aria-label="Go Back"
            onClick={props.onGoBack}>
            <IoArrowBackOutline />
          </button>
        }

        <button
          aria-label="Close"
          onClick={props.onClose}>
          <IoCloseSharp />
        </button>
      </header>
      <div 
        className="p6o-selection-content"
        style={{ maxHeight: `${window.innerHeight - 46}px` }}>
        {image &&
          <div 
            className="p6o-selection-header-image"
            style={{ backgroundImage: `url("${image.src}")` }}>   

            {image.accreditation &&
              <span 
                className="p6o-selection-header-image-accreditation">{image.accreditation}</span> 
            }

            <button 
              className="p6o-selection-header-image-btn-full"
              onClick={() => setShowLightbox(true) }>
              <CgArrowsExpandRight />
            </button>
          </div> 
        }

        <main
          role="region" 
          aria-live="polite">
          
          <div
            className="p6o-selection-main-fixed">

            <div
              className="p6o-source-link"
              onClick={() => window.open(sourceUrl, '_blank')}>
              <h1>
                <a 
                  href={sourceUrl} 
                  target="_blank"
                  onClick={tagNav}>
                  {node.title}
                </a>
              </h1>

              <h2>
                <a 
                  href={sourceUrl} 
                  target="_blank"
                  onClick={tagNav}>
                  View page on {node.dataset}<RiExternalLinkLine />
                </a>
              </h2>
              
              <a 
                href={sourceUrl}
                className="p6o-new-tab-hint"
                onClick={tagNav}
                target="_blank">Link opens a new tab</a>
            </div>

            <p className="p6o-node-types">
              {getTypes(node).join(', ')}
            </p>

            {when && 
              <p className="when">
                <strong>Timespan:</strong> {when.label}
              </p>
            }
          </div>

          <div className="p6o-selection-main-flex">
            {descriptions.map((d, idx) => 
              <p key={idx} 
                className="p6o-selection-description"
                aria-level={3}
                dangerouslySetInnerHTML={{
                  __html: highlight(sanitize(d), search?.query)
                }}>
                {}
              </p>
            )}
          </div>
        </main>

        <footer aria-live={true}>
          {connected.length > 0 ?
            <div
              className="p6o-selection-related-records">
              <button onClick={goTo} >
                <BiLink /> <span>{connected.length} Related Web Resources</span>
              </button>
            </div> :

            <div
              className="p6o-selection-related-records disabled">
              <BiLink /> <span>No Related Web Resources</span>
            </div>
          }
        </footer>
      </div>

      {showLightbox && 
        <FullscreenImage image={image} onClose={() => setShowLightbox(false)} />
      }
    </div>
  )

}

export default ItemCard;