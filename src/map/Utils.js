/**
 * TEMPORARY HACK!
 *
 * Note that rounding precision to 5 decimal digits corresponds roughly
 * to around a meter (depending on where in the world, obviously).
 * See: https://en.wikipedia.org/wiki/Decimal_degrees 
 */
export const collapseColocatedFeatures = (features, precision = 5) => {
  const grouped = {};

  features.forEach(f => {
    // Just a hack for now
    const [lon, lat] = f.geometry.coordinates;
    const key = lon.toFixed(precision) + ',' + lat.toFixed(precision);

    if (grouped[key]) {
      // Exists already - modify feature!
      const existing = grouped[key];
      const { colocated_records } = existing.properties;
      const count = colocated_records ? colocated_records + 1 : 1;

      grouped[key] = {
        ...existing,
        properties: {
          ...existing.properties,
          colocated_records: count
        }
      }
    } else {
      grouped[key] = f;
    }
  });

  return Object.values(grouped); 
}
