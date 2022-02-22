const groupBy = (arr, key) =>
  arr.reduce((grouped, obj) => {
    (grouped[obj[key]] = grouped[obj[key]] || []).push(obj);
    return grouped;
  }, {});

export const partitionBy = (features, facet) =>
  groupBy(features, facet);
