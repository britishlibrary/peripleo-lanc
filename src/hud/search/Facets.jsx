import React from 'react';
import { motion } from 'framer-motion';
import { SIGNATURE_COLOR } from '../../Colors';

const DUMMY_FACET = {
  title: 'Datasets',
  values: [
    { label: 'Hollar 1660', count: 100 },
    { label: 'Portable Antiquities Scheme', count: 5230 },
    { label: 'VisitPlus', count: 54 },
    { label: 'Leif\'s Coins and Monasteries', count: 212 }
  ]
}

const parentAnimation = {
  hidden: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.05
    }
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const childAnimation = {
  hidden: { 
    opacity: 0,
    width: 0 
  },
  visible: { 
    opacity: 1,
    width: 700,
    transition: {
      duration: 0.5
    }
  }
}

const Facets = props => {

  const facet = DUMMY_FACET;

  return (
    <motion.div 
      key="facets-container"
      className="p6o-facets-container">
      <div className="p6o-facets">
        {/* <h1>{facet.title}</h1> */}

        <motion.ul 
          variants={parentAnimation} 
          initial="hidden" 
          animate="visible"
          exit="hidden">

          {facet.values.map((f, idx) => 
            <motion.li 
              key="label"
              variants={childAnimation}>
              <div className="p6o-facet-value-wrapper">
                <span 
                  className="p6o-facet-value-count"
                  style={{ backgroundColor: SIGNATURE_COLOR[idx] }}>{f.count.toLocaleString('en')}</span>

                <span className="p6o-facet-value-label">{f.label}</span>
              </div>
            </motion.li>
          )}
        </motion.ul>

      </div>
    </motion.div>
  )

}

export default Facets;