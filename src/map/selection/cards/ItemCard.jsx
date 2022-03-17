import React, { useContext } from 'react';
import { BiHourglass } from 'react-icons/bi';
import { BsArrowsFullscreen } from 'react-icons/bs';

import { StoreContext } from '../../../store';
import { getPreviewImage, getTypes } from './Utils';

const ItemCard = props => {

  const { store } = useContext(StoreContext);

  const { node } = props;

  const image = getPreviewImage(node);

  const when = node.properties?.when;

  const connected = store.getConnectedNodes(node.id);

  // Hack for testing!
  const toNext = () => {
    if (connected.length > 0)
      props.onGoTo(connected[0]);
  }

  return (
    <div className="p6o-selection-card p6o-selection-itemcard">
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
            <h1 onClick={toNext}>{node.title}</h1>
            {when && 
              <h2>
                <BiHourglass /> {when}
              </h2>
            }
                
            <ul className="p6o-selection-types">
              {getTypes(node).map(t => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )

}

export default ItemCard;