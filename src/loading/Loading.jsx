import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

import ProgressBar from './ProgressBar';
import DatasetDetails from './DatasetDetails';

const Loading = props => {

  const { config } = props;

  const { stage } = props.state;

  const [ welcome, setWelcome ] = useState();

  const [ showDetails, setShowDetails ] = useState(false);

  // Show OK button only in loaded state, and if there's a welcome message or dataset details
  const showOkButton = stage === 'LOADED' && (welcome || props.datasetMetadata.length > 0);

  useEffect(() => {
    const welcome = config?.welcome_message;
    if (welcome) 
      fetch(welcome)
        .then(response => response.text())
        .then(setWelcome);
  }, [ config?.welcome_message]);

  useEffect(() => {
    // Without welcome message or dataset details, splash screen should close automatically
    if (stage === 'LOADED' && !showOkButton)
      setTimeout(() => props.onClose(), 2000);
  }, [stage])

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
    label = config?.welcome_message ? 'Ready!' : 'Almost ready!';
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
        {config && !config.welcome_message &&
          <img 
            className="logo-image"
            src="startup-logo.svg" />
        }
        
        {welcome && 
          <ReactMarkdown className="p6o-loading-welcome-message">
            {welcome}
          </ReactMarkdown>
        }

        <ProgressBar progress={props.state.progress} />        
        
        <p className="p6o-loading-stage">
          {label} {nodes + edges > 0 ?
            <>
              ({(props.state.nodes || 0).toLocaleString('en')} nodes/{(props.state.edges || 0).toLocaleString('en')} edges)
            </> : <>&nbsp;</>
          } {stage === 'LOADED' && props.datasetMetadata.length > 0 &&
            <button 
              className="p6o-show-dataset-metadata"
              onClick={() => setShowDetails(true)}>
              Show details
            </button>
          }
        </p>

        <button 
          className="p6o-loading-welcome-close"
          disabled={!showOkButton}
          onClick={props.onClose}>Ok</button>
      </div>

      {showDetails &&
        <DatasetDetails 
          data={props.datasetMetadata} 
          onClose={() => setShowDetails(false)} />
      }
    </motion.div>
  )

}

export default Loading;