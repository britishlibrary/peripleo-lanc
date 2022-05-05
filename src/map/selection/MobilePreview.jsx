import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

const animation = {
  closed: { 
    maxHeight: 0 
  },
  open: { 
    maxHeight: window.innerHeight  
  }
}

const MobilePreview = props => {
  
  return ReactDOM.createPortal(
    <motion.div 
      key="mobile-selection-preview"
      className="p6o-mobile-selection-preview"
      variants={animation}
      initial="closed"
      animate="open"
      exit="closed">
      {props.children}
    </motion.div>,

    document.body
  )

}

export default MobilePreview;