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

const computeFacet = (items, facetName, fn, postFilter) => {
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
  
    // If there is a post-filter, remove all items that don't satisfy 
    // the filter condition (counts should remain unchanged though!)
    items: postFilter ? facetedItems.filter(postFilter) : facetedItems
  };
}

const computeSimpleFieldFacet = (items, facet, postFilter) =>
  computeFacet(items, facet.name, item => item[facet.definition], postFilter);

const computeCustomFnFacet = (items, facet, postFilter) => 
  computeFacet(items, facet.name, facet.definition, postFilter);

const computeNestedFieldFacet = (items, facet, postFilter) => {

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

  return computeFacet(items, facet.name, item => getValueRecursive(item, facet.definition), postFilter);
}

export const computeFacetDistribution = (items, facet, postFilter) => {
  const { definition } = facet;
  if (Array.isArray(definition))
    return computeNestedFieldFacet(items, facet, postFilter);
  else if (definition instanceof Function)
    return computeCustomFnFacet(items, facet, postFilter);
  else 
    return computeSimpleFieldFacet(items, facet, postFilter);
}