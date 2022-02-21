import React from 'react';
import { motion } from 'framer-motion';

const SearchToolbar = props => {

  return (
    <motion.div className="p6o-hud-searchtoolbar">
      <div className="p6o-hud-searchtoolbar-flexwrapper">
        <div className="p6o-hud-searchtoolbar-results">
        </div>
      </div>
      <div className="p6o-hud-searchtoolbar-flexwrapper">
        <div className="p6o-hud-searchtoolbar-dig">
        
        </div>
      </div>
    </motion.div>
  )

}

export default SearchToolbar;