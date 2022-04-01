export class Facet {

  constructor(name, definition, condition) {
    this.name = name;
    this.definition = definition;
    this.condition = condition;
  } 

}

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

  const getValueRecursive = (obj, path, condition) => {
    const [ nextSegment, ...pathRest ] = path;

    const meetsCondition = obj => {
      if (!condition)
        return true;
      
      const [ key, val ] = condition;

      // If obj doesn't have the condition key -> admit
      if (!obj[key])
        return true;

      // If obj has the key, and the value matches -> admit
      if (obj[key] === val)
        return true;

      return false;
    }

    const value = obj[nextSegment];
    if (pathRest.length === 0 || !value) {
      return value;
    } else {
      return Array.isArray(value) ?

        value.filter(meetsCondition)
          .map(obj => getValueRecursive(obj, pathRest, condition))
          .filter(value => value) // Remove undefined

        :
        
        meetsCondition(value) ?
          getValueRecursive(value, pathRest, condition) : [];       
    }
  };

  return computeFacet(items, facet.name, item => getValueRecursive(item, facet.definition, facet.condition), postFilter);
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