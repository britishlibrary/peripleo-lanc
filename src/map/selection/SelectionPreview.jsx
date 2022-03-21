import React, { useEffect, useState } from 'react';
import { Popup } from 'react-map-gl';

import CardStack from './cards/CardStack';
import ItemCard from './cards/ItemCard';
import ItemListCard from './cards/ItemListCard';

const SelectionPreview = props => {

  const [ cards, setCards ] = useState([ props ]); 

  const [ reset, setReset ] = useState(props.feature) 

  const { node, feature } = props;

  const { coordinates } = (node.geometry || feature.geometry);

  useEffect(() => {
    setCards([ props ]);
    setReset(true);
  }, [ props.feature ]);

  const onGoTo = nodeOrNodes => {
    setReset(false);

    const arr = Array.isArray(nodeOrNodes) ? nodeOrNodes : [ nodeOrNodes ];
    const data = arr.map(node => ({...props, node }));

    if (arr.length === 1) {
      const link = data[0];
      if (link.node.properties)
        setCards([ ...cards, link ]); // Open internal link directly
      else 
        setCards([ ...cards, [ link ]]); // External link: show list
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
        reset={reset}
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