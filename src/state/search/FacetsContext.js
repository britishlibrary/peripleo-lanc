import React, { createContext, useState } from 'react';

import { Facet } from './Facets';

const DEFAULT_FACETS = [
  // Facet value = value of the top-level 'dataset' field
  new Facet('dataset', 'dataset'),

  // Facet value is 'With Image' or 'Without Image', based on eval function
  new Facet('has_image', record => record.depictions?.length > 0 ? 'With Image' : 'Without Image'),

  // Facet value = value of the types > label fields
  new Facet('type', ['types', 'label'])
];

export const FacetsContext = createContext({
  availableFacets: DEFAULT_FACETS,
  setAvailableFacets: () => {}
});

export const FacetsContextProvider = props => {

  const [ facets, setFacets ] = useState(DEFAULT_FACETS);

  const setFromDefinitions = definitions => {
    setFacets(definitions.map(definition => {
      if ((typeof definition === 'string' || definition instanceof String)) {
        // Built-in facet
        return DEFAULT_FACETS.find(f => f.name === definition);
      } else if (definition.name && definition.path) {
        return new Facet(definition.name, definition.path, definition.condition);
      }
    }));
  }

  const value = { availableFacets: facets, setAvailableFacets: setFromDefinitions };

  return (
    <FacetsContext.Provider value={value}>
      {props.children}
    </FacetsContext.Provider>
  )

}