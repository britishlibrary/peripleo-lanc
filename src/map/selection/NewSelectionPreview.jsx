import React, { useState } from 'react';
import { Popup } from 'react-map-gl';

import CardStack from './cards/CardStack';
import ItemCard from './cards/ItemCard';

const SelectionPreview = props => {

  const [cards, setCards] = useState([ props ]); 

  const { node, feature } = props;

  const { coordinates } = (node.geometry || feature.geometry);

  const onGoTo = node =>
    setCards([ ...cards, { ...props, node }]);

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
        render={props => 
          <ItemCard 
            {...props} 
            onGoTo={onGoTo} 
            onGoBack={onGoBack} /> 
        }
      />
    </Popup>
  )

}

export default SelectionPreview;