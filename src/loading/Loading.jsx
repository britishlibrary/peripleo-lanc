import React from 'react';
import { motion } from 'framer-motion';

import ProgressBar from './ProgressBar';

const Loading = props => {

  const { stage } = props.state;

  let label;

  if (stage === 'LOADING_CONFIG') {
    label = 'Loading configuration data';
  } else if (stage === 'LOADING_DATA' && props.state.dataset) {
    label = `Loading: ${props.state.dataset}`;
  } else if (stage === 'LOADING_DATA') {
    label = 'Starting Peripleo';
  } else if (stage === 'ERROR') {
    label = `An error occurred (${props.state.cause})`;
  } else {
    label = 'Almost ready!';
  }

  const nodes = props.state.nodes || 0;
  const edges = props.state.edges || 0;

  return (
    <motion.div 
      className="p6o-loading"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      exit={{ opacity: 0 }}>

      <div className="p6o-loading-center">
        <img 
          className="logo-image" 
          src="startup-logo.svg" />

        <ProgressBar progress={props.state.progress} />        
        
        <p className="p6o-loading-stage">
          {label} {nodes + edges > 0 ?
            <>
              ({(props.state.nodes || 0).toLocaleString('en')} nodes/{(props.state.edges || 0).toLocaleString('en')} edges)
            </> : <>&nbsp;</>
          } 
        </p>
      </div>

      <div className="p6o-loading-bottom">
        Peripleo-LaNC v0.1.0
      </div>
    </motion.div>
  )

}

export default Loading;