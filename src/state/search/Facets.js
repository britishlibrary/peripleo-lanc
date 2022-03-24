export class Facet {

  constructor(name, definition) {
    this.name = name;
    this.definition = definition;
  } 

}

export const DEFAULT_FACETS = [
  // Facet value = value of the top-level 'dataset' field
  new Facet('dataset', 'dataset'),

  // Facet value is 'With Image' or 'Without Image', based on eval function
  new Facet('has_image', record => record.depictions?.length > 0 ? 'With Image' : 'Without Image'),

  // Facet value = value of the types > label fields
  new Facet('type', ['types', 'label'])
];

const toSortedArray = counts => {
  const entries = Object.entries(counts);
  entries.sort((a, b) => b[1] - a[1]);
  return entries;
}

const computeFacet = (items, facetName, fn) => {
  const counts = {};

  const facetedItems = items.map(item => {
    const value = fn(item);
    
    if (value) {
      const values = Array.isArray(value) ? value : [ value ];

      values.forEach(v =>
        counts[v] = counts[v] ? counts[v] + 1 : 1);

      return {
        ...item,
        _facet: {
          name: facetName,
          values
        }
      };
    } else {
      return item;
    }
  });

  return {
    facet: facetName,
    counts: toSortedArray(counts),
    items: facetedItems
  };
}

const computeSimpleFieldFacet = (items, facet) =>
  computeFacet(items, facet.name, item => item[facet.definition]);

const computeCustomFnFacet = (items, facet) => 
  computeFacet(items, facet.name, facet.definition);

const computeNestedFieldFacet = (items, facet) => {

  const getValueRecursive = (obj, path) => {
    const [ nextSegment, ...pathRest ] = path;

    const value = obj[nextSegment];
    if (pathRest.length === 0 || !value) {
      return value;
    } else {
      return Array.isArray(value) ?
        value.map(obj => getValueRecursive(obj, pathRest)): 
        getValueRecursive(value, pathRest);
    }
  };

  return computeFacet(items, facet.name, item => getValueRecursive(item, facet.definition));
}

export const computeFacetDistribution = (items, facet) => {
  const { definition } = facet;
  if (Array.isArray(definition))
    return computeNestedFieldFacet(items, facet);
  else if (definition instanceof Function)
    return computeCustomFnFacet(items, facet);
  else 
    return computeSimpleFieldFacet(items, facet);
}