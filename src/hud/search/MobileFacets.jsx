import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { FiMoreHorizontal } from 'react-icons/fi';
import { HiOutlineChevronLeft } from 'react-icons/hi';

import { mapModeState } from '../../state';
import { SIGNATURE_COLOR } from '../../Colors';
import { formatNumber } from './Facets';

const animation = {
  closed: { 
    left: -100 
  },
  open: { 
    left: 0
  }
}


const MobileFacets = props => {

  const [ collapsed, setCollapsed ] = useState(true);

  const mapMode = useRecoilValue(mapModeState);

  const counts = props.search.facetDistribution?.counts || [];

  const displayed = counts.slice(0, 8);

  // const remaining = counts.length - displayed.length;

  return (
    <motion.div 
      className={collapsed ? "p6o-mobile-facets collapsed" : "p6o-mobile-facets" }
      onClick={() => setCollapsed(!collapsed)}
      variants={animation}
      initial="closed"
      animate="open"
      exit="closed">
      <ul>
        {displayed.map(([label, count], idx) => 
          <li key={label + idx}>
            <span className="p6o-facet-value-label">{label}</span>

            <span 
              className="p6o-facet-value-count"
              style={{ 
                backgroundColor: mapMode === 'clusters' ? '#7a7a7a' : SIGNATURE_COLOR[idx] 
              }}>{formatNumber(count)}</span>
          </li>
        )}
      </ul>

      <div className="p6o-facet-toggle-button">
        <button>
          <FiMoreHorizontal className="open" />
          <HiOutlineChevronLeft className="close" />
        </button>
      </div>
    </motion.div>
  )

}

export default MobileFacets