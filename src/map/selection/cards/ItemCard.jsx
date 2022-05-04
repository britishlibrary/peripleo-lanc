import React, { useContext, useEffect, useRef, useState } from 'react';
import { BiNetworkChart } from 'react-icons/bi';
import { BsHourglassSplit } from 'react-icons/bs';
import { IoArrowBackOutline, IoCloseSharp } from 'react-icons/io5';
import { RiExternalLinkLine } from 'react-icons/ri';
import { CgArrowsExpandRight } from 'react-icons/cg';

import { SIGNATURE_COLOR } from '../../../Colors';

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
  return <>{parts.map((part, idx) => part.toLowerCase() === query.toLowerCase() ? <mark key={part + idx}>{part}</mark> : part)}</>;
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

  // Related items includes external + internal links!
  const connected = [
    ...store.getConnectedNodes(node.id),
    ...store.getExternalLinks(node.id)
  ];

  const goTo = () => props.onGoTo({
    referrer: props,
    nodeList: connected
  });
  
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

            <div className="p6o-source-link">
              <h1>
                <a href={sourceUrl} target="_blank">
                  {node.title}
                </a>
              </h1>

              <h2>
                <a href={sourceUrl} target="_blank">
                  View page on {node.dataset}<RiExternalLinkLine />
                </a>
              </h2>
              
              <a 
                href={sourceUrl}
                className="p6o-new-tab-hint"
                target="_blank">Link opens a new tab</a>
            </div>

            <p className="p6o-node-types">
              {getTypes(node).join(', ')}
            </p>

            {when && 
              <p className="when">
                <BsHourglassSplit /> {when.label}
              </p>
            }
          </div>

          <div className="p6o-selection-main-flex">
            {descriptions.map((d, idx) => 
              <p key={idx} 
                className="p6o-selection-description"
                aria-level={3}>
                {highlight(d, search?.query)}
              </p>
            )}
          </div>
        </main>

        <footer aria-live={true}>
          {connected.length > 0 ?
            <div
              className="p6o-selection-related-records">
              <button onClick={goTo} >
                <BiNetworkChart /> <span>{connected.length} Related Records</span>
              </button>
            </div> :

            <div
              className="p6o-selection-related-records disabled">
              <BiNetworkChart /> <span>No Related Records</span>
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