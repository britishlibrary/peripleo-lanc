import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePlusCircle } from 'react-icons/hi';

import More from './More';
import { SIGNATURE_COLOR } from '../../Colors';
import { mapModeState } from '../../state';

export const formatNumber = num => {
  if (num > 1000)
    return (num / 1000).toFixed(1) + 'k';
  else if (num > 1000000)
    return (num / 1000000).toFixed(1) + 'M';
  else 
    return num;
}

export const getTopEight = (facetCounts, filterValues) => {
  let topEight = [];

  const filterCounts = filterValues ?
    filterValues
      .map(label => facetCounts.find(c => c[0] === label))
      .filter(c => c) /* remove undefined */ : [];
  
  filterCounts.sort((a, b) => b[1] - a[1]);

  if (filterCounts.length > 7) {
    // More than 7 current filters -> display top 8
    topEight = filterCounts.slice(0, 8);
  } else if (filterCounts.length > 0) {
    // Less than 8 filer values -> fill up the rest with top counts
    const unselected = facetCounts.filter(c => !filterCounts.find(s => s[0] === c[0]));
    topEight = [...filterCounts, ...unselected.slice(0, 8 - filterCounts.length)];
    topEight.sort((a, b) => b[1] - a[1]);
  } else {
    // No filters - just display top 8
    topEight = facetCounts.slice(0, 8);
  }

  return topEight;
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
    maxWidth: 0 
  },
  visible: { 
    opacity: 1,
    maxWidth: 500,
    transition: {
      duration: 0.5
    }
  }
}

const equivalentFilters = (a, b) => {
  if (a.length === b.length) {
    const setA = new Set(a);
    const setB = new Set(b);

    for (const x of setA) if (!setB.has(x)) return false;
    return true;
  } else {
    return false;
  }
}

const Facets = props => {

  const mapMode = useRecoilValue(mapModeState);

  const [ showMore, setShowMore ] = useState(false);

  const counts = props.search.facetDistribution?.counts || [];

  // Display up to 8 current filters + fill the rest
  // with the top facets

  // Filter values on the current facet (if any)
  const currentFacetFilter = props.search.filters.find(f => f.facet === props.search.facet);

  const displayed = getTopEight(counts, currentFacetFilter?.values);
  const remaining = counts.length - displayed.length;

  const onToggleFilter = label => () => {
    const allDisplayed = displayed.map(t => t[0]);
    const filterValues = currentFacetFilter?.values || [];
    const filterValuesAfter = [...filterValues, label ];

    const isAllValues = equivalentFilters(allDisplayed, filterValuesAfter); 

    // If the user has enabled all displayed filter values -> remove filter on this facet!
    if (isAllValues)
      props.onClearFilter();
    else
      props.onToggleFilter(label);
  }

  const onSetMoreFilters = values => {
    props.onSetFilters(values);
    setShowMore(false);
  }

  return (
    <motion.div 
      key="facets-container"
      className="p6o-facets-container">
      <div className="p6o-facets">
        <motion.div
          className={props.arrows ? 'p6o-facets-carousel' : 'p6o-facets-carousel centered'}
          variants={parentAnimation}
          initial="hidden"
          animate="visible"
          exit="hidden">

          {props.arrows &&
            <button 
              tabIndex={4}
              aria-label="Previous filter category"
              onClick={props.onPreviousFacet}>
              <HiOutlineChevronLeft />
            </button>
          }
          
          <h3 
            aria-live="polite"
            aria-atomic={true}>
            {props.search.facet.replace('_', ' ')}
          </h3>
          
          {props.arrows && 
            <button
              tabIndex={5}
              aria-label="Next filter category" 
              onClick={props.onNextFacet}>
              <HiOutlineChevronRight />
            </button>
          }
        </motion.div>

        <motion.ul 
          variants={parentAnimation} 
          initial="hidden" 
          animate="visible"
          exit="hidden">

          {displayed.map(([label, count], idx) => 
            <motion.li 
              key={label + idx}
              className={currentFacetFilter &&
                (currentFacetFilter.values.includes(label) ? 'p6o-filter-shown' : 'p6o-filter-hidden')}
              variants={childAnimation}
              onClick={onToggleFilter(label)}>
              <div className="p6o-facet-value-wrapper">
                <span 
                  className="p6o-facet-value-count"
                  style={{ 
                    backgroundColor: mapMode === 'clusters' ? '#7a7a7a' : SIGNATURE_COLOR[idx] 
                  }}>{formatNumber(count)}</span>

                <span className="p6o-facet-value-label">{label}</span>
              </div>
            </motion.li>
          )}

          {remaining > 0 && 
            <motion.li
              key="p6o-remaining"
              variants={childAnimation}
              className="p6o-facet-values-remaining"
              onClick={() => setShowMore(true)}>
              <div className="p6o-facet-value-wrapper">
                <span><HiOutlinePlusCircle /> {remaining} more</span>
              </div>
            </motion.li>
          }
        </motion.ul>
      </div>

      {showMore &&
        <More 
          search={props.search} 
          onSet={onSetMoreFilters}
          onCancel={() => setShowMore(false)}/>
      }
    </motion.div>
  )

}

export default Facets;