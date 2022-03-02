const createMockResults = (num, dataset) =>
  new Array(num).fill({ dataset });

export const mockResults = [
  ...createMockResults(11403, 'Portable Antiquities Scheme'),
  ...createMockResults(1622, 'VisitPlus'),
  ...createMockResults(94, 'Hollar')
];