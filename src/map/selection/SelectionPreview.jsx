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

  const onGoTo = arg => {
    setReset(false);

    const data = arg.nodeList ?
      { ...arg, nodeList: arg.nodeList.map(node => ({...props, node }))} :
      { ...props, node: arg };

    const isList = data.nodeList?.length > 1;
    if (isList) {
      setCards([ ...cards, data ]);
    } else {
      // Single link
      const link = data.nodeList ? data.nodeList[0] : data;
      if (link.node.properties) {
        setCards([ ...cards, link ]); // Open internal link directly
      } else { 
        setCards([ ...cards, data ]); // External link: show list
      }
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
        render={data => data.nodeList ?

        <ItemListCard 
          {...data} 
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