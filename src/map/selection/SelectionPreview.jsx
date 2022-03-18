import React, { useEffect, useState } from 'react';
import { Popup } from 'react-map-gl';

import CardStack from './cards/CardStack';
import ItemCard from './cards/ItemCard';
import ItemListCard from './cards/ItemListCard';

const SelectionPreview = props => {

  const [ cards, setCards ] = useState([ props ]); 

  const { node, feature } = props;

  const { coordinates } = (node.geometry || feature.geometry);

  useEffect(() => {
    setCards([ props ]);
  }, [ props.feature ]);

  const onGoTo = connected => {
    const data = connected.map(node => ({...props, node }));

    if (connected.length === 1) {
      // Next card: node
      setCards([ ...cards, data[0] ]);
    } else {
      // Next card: list
      setCards([ ...cards, data ]);
    }
  }

  const onGoBack = () => {
    if (cards.length > 1)
      setCards(cards.slice(0, cards.length - 1));
  }

  return (
    <Popup
      longitude={coordinates[0]} 
      latitude={coordinates[1]}
      maxWidth={440}
      closeButton={false}
      closeOnClick={false}>
      
      <CardStack 
        cards={cards} 
        render={data => Array.isArray(data) ?
          <ItemListCard 
            data={data} 
            onClose={props.onClose} 
            onGoTo={onGoTo} 
            onGoBack={onGoBack} /> :

          <ItemCard 
            {...data}
            backButton={cards.length > 1}
            onClose={props.onClose}
            onGoTo={onGoTo} 
            onGoBack={onGoBack} /> 
        }
      />
    </Popup>
  )

}

export default SelectionPreview;