import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import SearchToolbar from './SearchToolbar';

const SearchPanel = props => {

  const el = useRef();

  useEffect(() => {
    if (el.current)
      el.current.querySelector('input').focus();
  }, [ el.current ]);

  const onChange = evt =>
    props.onChange(evt.target.value);

  return (
    <motion.div 
      ref={el}
      className="p6o-hud-searchpanel"
      transition={{ type: 'spring', duration: 0.4 }}
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 340 }}
      exit={{ opacity: 0, width: 0 }}>

      <div className="p6o-hud-searchinput">
        <input 
          value={props.query || ''} 
          onChange={onChange} />
      </div>

      {/*
      <AnimatePresence>
        <SearchToolbar />
      </AnimatePresence>
      */}
      
    </motion.div>
  )

}

export default SearchPanel;