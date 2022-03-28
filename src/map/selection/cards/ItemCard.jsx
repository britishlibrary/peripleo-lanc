import React, { useContext, useEffect, useRef, useState } from 'react';
import { BiNetworkChart } from 'react-icons/bi';
import { BsHourglassSplit } from 'react-icons/bs';
import { IoArrowBackOutline, IoCloseSharp } from 'react-icons/io5';
import { RiExternalLinkLine } from 'react-icons/ri';
import { CgArrowsExpandRight } from 'react-icons/cg';

import { SIGNATURE_COLOR } from '../../../Colors';

import { StoreContext } from '../../../store';
import { formatTime, getPreviewImage, getTypes } from './Utils';

import FullscreenImage from './FullscreenImage';

const ItemCard = props => {
  const el = useRef();

  const { store } = useContext(StoreContext);

  const [ showLightbox, setShowLightbox ] = useState(false);

  const { node } = props;

  useEffect(() => {
    if (el.current) {
      el.current.querySelector('header button').blur();
    }
  }, [ el.current ]);

  const image = getPreviewImage(node);

  const sourceUrl = 
    node.properties?.url || node?.identifier || node.id;

  const when = node.properties?.when;

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
        className="p6o-selection-content">
        {image &&
          <div 
            className="p6o-selection-header-image"
            style={{ backgroundImage: `url("${image}")` }}>   

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
            <h1>
              <a href={sourceUrl} target="_blank">
                {node.title}
              </a>
            </h1>

            <h2>
              <a href={sourceUrl} target="_blank">
                {node.dataset}<RiExternalLinkLine />
              </a>
            </h2>
            
            <a 
              href={sourceUrl}
              className="p6o-new-tab-hint"
              target="_blank">Link opens a new tab</a>

            <ul className="p6o-selection-types">
              {getTypes(node).map(t => <li key={t}>{t}</li>)}
            </ul>

            {when && 
              <p className="when">
                <BsHourglassSplit /> {formatTime(String(when))}
              </p>
            }
          </div>

          <div className="p6o-selection-main-flex">
            {node.properties.description &&
              <p 
                className="p6o-selection-description"
                aria-level={3}>
                {node.properties.description}
              </p>
            }
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
        <FullscreenImage src={image} onClose={() => setShowLightbox(false)} />
      }
    </div>
  )

}

export default ItemCard;