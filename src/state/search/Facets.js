export class Facet {

  constructor(name, definition, condition, dynamicCondition) {
    this.name = name;
    this.definition = definition;
    this.condition = condition;
    this.dynamicCondition = dynamicCondition;
  } 

}

const toSortedArray = counts => {
  const entries = Object.entries(counts);
  entries.sort((a, b) => a[0].localeCompare(b[0]));
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

const computeNestedFieldFacet = (items, facet, postFilter, dynamicConditions) => {

  const getValueRecursive = (obj, path, condition, dynamicConditions) => {
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

      //if the dynamic condition exists and is not an empty array
      if (dynamicConditions && dynamicConditions.length > 0){
        let isFilteredItem = true;
        //loop over the dynamic condition path/values
        dynamicConditions.map(condition =>{
            //check that for each condition the manuscript (path) matches one of the values
            //if the item does not meet one of the conditions, set to false
            isFilteredItem = condition.values.includes(obj[condition.path]);
        })
        //if the item matched all conditions, return the value to be counted in the facet counts
        if (isFilteredItem){
          return value;
        }
      }
      else if (!dynamicConditions || dynamicConditions.length == 0){
        return value;
      }
      
    } else {
      return Array.isArray(value) ?

        value.filter(meetsCondition)
          .map(obj => getValueRecursive(obj, pathRest, condition, dynamicConditions))
          .filter(value => value) // Remove undefined

        :
        
        meetsCondition(value) ?
          getValueRecursive(value, pathRest, condition, dynamicConditions) : [];       
    }
  };

  return computeFacet(items, facet.name, item => getValueRecursive(item, facet.definition, facet.condition, dynamicConditions), postFilter);
}

export const computeFacetDistribution = (items, facet, postFilter, queryFilters) => {
  const { definition } = facet;
  
  //create an array of dynamic conditions with the path and values
  //the values will create an additional filter for creating the counts to display in a facet
  let dynamicConditions= [];
  
  //check if there are filters and the current facet has one or more dynamic conditions
  if(Array.isArray(queryFilters) && facet.dynamicCondition){
    //for each dynamic condition, select the path and values
    facet.dynamicCondition.map(condition => {
      let pair = {};
      //path
      pair["path"] = condition.path;
      //values are found in the filter with the same facet as the condition name
      let dynamicValues = queryFilters.find(f => f.facet === condition.name); 
      if (dynamicValues){
        pair["values"] = dynamicValues.values;
        //assign path/values only if there are values to filter with
        dynamicConditions.push(pair);
      }
      
      });
    }

  if (Array.isArray(definition))
    //the Language/Manuscript/location facets should each be filtered by the other two!
    return computeNestedFieldFacet(items, facet, postFilter, dynamicConditions);
  else if (definition instanceof Function)
    return computeCustomFnFacet(items, facet, postFilter);
  else 
    return computeSimpleFieldFacet(items, facet, postFilter);
}
