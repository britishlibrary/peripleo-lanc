import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VscListUnordered } from 'react-icons/vsc';
import { GiSpade } from 'react-icons/gi';

import Facets from './Facets';

// EXPERIMENTAL
import SearchResults from '../../SearchResults';

const parentAnimation = {
  visible: { 
    opacity: 1, 
    width: 380
  },
  hidden: { 
    opacity: 0,
    width: 0
  }
};

const childAnimation = {
  visible: { 
    opacity: 1, 
    height: 40
  },
  hidden: { 
    opacity: 0,
    height: 0
  }
};

const SearchPanel = props => {

  const el = useRef();

  const [ facet, setFacet ] = useState();

  const results = new SearchResults(props.results);

  useEffect(() => {
    if (el.current)
      el.current.querySelector('input').focus();
  }, [ el.current ]);

  const onChange = evt =>
    props.onChange(evt.target.value);

  const onToggleFacet = () => {
    if (facet)
      setFacet(null);
    else
      setFacet(results.facets[0]);
  }

  return (
    <motion.div 
      ref={el}
      className="p6o-hud-searchpanel"
      variants={parentAnimation}
      transition={{ type: 'spring', duration: 0.4 }}
      initial="hidden"
      animate="visible"
      exit="hidden">

      <div className="p6o-hud-searchinput">
        <input 
          value={props.query || ''} 
          onChange={onChange} />
      </div>

      <motion.div
        className="p6o-hud-searchtoolbar"
        variants={childAnimation}
        initial="hidden"
        animate="visible"
        exit="hidden">
        
        <div className="p6o-hud-searchtoolbar-wrapper">
          <div className="p6o-hud-searchtoolbar-resultcount">
            {props.results.length.toLocaleString('en')} Result{props.results.length !== 1 && 's'}
          </div>
          
          <button className="p6o-hud-searchtoolbar-btn p6o-hud-searchtoolbar-btn-list">
            <VscListUnordered />
          </button>

          <button className="p6o-hud-searchtoolbar-btn p6o-hud-searchtoolbar-btn-dig">
            <GiSpade onClick={onToggleFacet}/>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {facet && <Facets results={results} facet={facet} /> }
      </AnimatePresence>
    </motion.div>
  )

}

export default SearchPanel;