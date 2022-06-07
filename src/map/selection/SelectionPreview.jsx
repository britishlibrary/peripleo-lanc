import React, { useEffect, useRef, useState } from 'react';
import { Popup } from 'react-map-gl';
import { useRecoilValue } from 'recoil';

import { deviceState } from '../../state';
import { insertSeoData } from '../../state/SelectionMetadata';
import { isInViewport } from './isInViewport';

import CardStack from './cards/CardStack';
import ItemCard from './cards/ItemCard';
import ItemListCard from './cards/ItemListCard';
import MobilePreview from './MobilePreview';

const SelectionPreview = props => {

  const elem = useRef();

  const device = useRecoilValue(deviceState);

  const { node, nodeList, feature } = props;

  const initial = node ? 
    [ props ] :  [{
      nodeList: nodeList.map(node => ({ ...props, nodeList: null, node }))
    }];

  const [ cards, setCards ] = useState(initial); 

  const [ reset, setReset ] = useState(props.feature); 

  const { coordinates } = node ? (node.geometry || feature.geometry) : feature.geometry;

  useEffect(() => {
    const cards = props.node ? 
      [ props ] : [{
        nodeList: props.nodeList.map(node => ({...props, nodeList:null, node }))
      }];

    setCards(cards);
    setReset(true);
  }, [ props.feature ]);

  useEffect(() => {
    // Bit of a hack...
    if (node)
      insertSeoData(node);

    setTimeout(() => {
      if (!isInViewport(elem.current))
        props.moveIntoView(coordinates, elem.current.getBoundingClientRect());
    }, 300);
  }, [ node ]);

  const onGoTo = arg => {
    setReset(false);

    const data = arg.nodeList ?
      { ...arg, nodeList: arg.nodeList.map(node => ({ config: props.config, node }))} :
      { config: props.config, node: arg };

    const isList = data.nodeList?.length > 1;
    if (isList) {      
      setCards([ ...cards, data ]);
    } else {
      // Single link
      const link = data.nodeList ? data.nodeList[0] : data;

      // Bit of a hack...
      insertSeoData(link.node);

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

  const Preview = device === 'MOBILE' ? MobilePreview : Popup;

  return (
    <Preview      
      longitude={coordinates[0]} 
      latitude={coordinates[1]}
      maxWidth={440}
      closeButton={false}
      closeOnClick={false}>
      
      <CardStack 
        ref={elem}
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
    </Preview>
  )

}

export default SelectionPreview;