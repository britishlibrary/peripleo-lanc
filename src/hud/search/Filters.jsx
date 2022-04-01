import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { MdOutlineFilterAlt } from 'react-icons/md';

import useSearch from '../../state/search/useSearch';

const animation = {
  hidden: { 
    maxHeight: 0
  },
  visible: { 
    maxHeight: 42
  }
}

const Filter = props => {

  return (
    <div className="p6o-hud-filter-group">
      <span>
        <MdOutlineFilterAlt />
        {props.facet.replace('_', ' ')}: {props.values.join(', ')}
      </span>
      <IoCloseCircleSharp onClick={props.onClear} />
    </div>
  )

}

const Filters = () => {

  const { search, clearFilter } = useSearch();

  const onClear = filterFacet => () =>
    clearFilter(filterFacet);

  return (
    <div className="p6o-hud-filters-container">
      <ul>
        <AnimatePresence>
          {search.filters.map(filter =>
            <motion.li
              key={filter.facet}
              variants={animation}
              initial="hidden"
              animate="visible"
              exit="hidden">

              <Filter 
                onClear={onClear(filter.facet)}
                {...filter} />

            </motion.li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  )

}

export default Filters;