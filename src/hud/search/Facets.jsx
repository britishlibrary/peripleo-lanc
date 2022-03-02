import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

import { SIGNATURE_COLOR } from '../../Colors';

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

  const values = props.results.getFacetValues(props.facet);

  return (
    <motion.div 
      key="facets-container"
      className="p6o-facets-container">
      <div className="p6o-facets">
        <motion.div
          className="p6o-facets-carousel"
          variants={parentAnimation}
          initial="hidden"
          animate="visible"
          exit="hidden">

          <button>
            <HiOutlineChevronLeft />
          </button>
          
          <h3>{props.facet}</h3>
          
          <button>
            <HiOutlineChevronRight />
          </button>
        </motion.div>

        <motion.ul 
          variants={parentAnimation} 
          initial="hidden" 
          animate="visible"
          exit="hidden">

          {Object.entries(values).map(([label, results], idx) => 
            <motion.li 
              key={label}
              variants={childAnimation}>
              <div className="p6o-facet-value-wrapper">
                <span 
                  className="p6o-facet-value-count"
                  style={{ backgroundColor: SIGNATURE_COLOR[idx] }}>{results.length.toLocaleString('en')}</span>

                <span className="p6o-facet-value-label">{label}</span>
              </div>
            </motion.li>
          )}

        </motion.ul>

      </div>
    </motion.div>
  )

}

export default Facets;