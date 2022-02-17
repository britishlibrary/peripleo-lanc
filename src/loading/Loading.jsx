import React from 'react';
import { motion } from 'framer-motion';

const Loading = props => {

  const { stage } = props.state;

  return (
    <motion.div 
      className="p6o-loading"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}>

      <div className="p6o-loading-center">
        <div>
          <h1>Loading</h1>
          <p className="p6o-loading-stage">{props.state.stage}</p>

          {stage === 'LOADING_DATA' && 
            <p className="p6o-loading-data-details">
              {props.state.progress} {props.state.dataset} {props.state.nodes} Nodes, {props.state.edges} Edges
            </p> 
          }

          {(stage === 'LOADED' || stage === 'CLOSE') && 
            <p className="p6o-loading-complete">
              {props.state.nodes} Nodes, {props.state.edges} Edges
            </p> 
          }
        </div>
      </div>

      <div className="p6o-loading-bottom">
        Peripleo-LaNC v0.1.0
      </div>
    </motion.div>
  )

}

export default Loading;