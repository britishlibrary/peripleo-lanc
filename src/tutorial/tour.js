import React from 'react';

const tour = [{
  target: '.p6o-search-button',
  title: 'Your journey starts here',
  content: 'Click the spyglass button to enter a text search of the loaded map data.',
  disableBeacon: true
}, {
  target: '.p6o-filters-button',
  content: 'Or click the filter button below to open the filter panel.',
  disableBeacon: true
},{
  target: '.p6o-facets',
  title: 'The Filter Panel',
  content: 'With the filter panel open, the map shows different types of data in different colors.',
  disableBeacon: true
},{
  target: '.p6o-facets-carousel',
  content: 'You can cycle through the available filter categories by clicking the arrows.',
  disableBeacon: true
},{
  target: '.p6o-facets ul',
  content: 'You can filter the data on the map by clicking the labels.',
  disableBeacon: true
},{
  target: '.p6o-map-modes',
  title: 'Map Modes',
  content: 'You can show data in different ways by changing the map mode here.',
  disableBeacon: true
},{
  target: 'body',
  placement: 'center',
  title: 'That\'s it!',
  content: 
    <span>
      Thanks for taking the time. Have fun exploring our Peripleo mapping prototype.
      If you want to know more about the software, <a href="https://github.com/britishlibrary/peripleo-lanc" target="_blank">click here</a>.
    </span>
}];

export default tour;