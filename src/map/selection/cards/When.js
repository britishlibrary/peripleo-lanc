const parseValue = val => {
  const str = String(val);

  if (str.includes('/')) {
    const [earliest, latest] = str.split('/').map(s => parseInt(s.trim()));
    return { earliest, latest };
  } else if (str.includes('>=')) {
    const earliest = parseInt(str.replace('>=', ''));
    return { earliest }
  } else {
    return { year: parseInt(str)}
  }
}

const parseFull = obj => {
  const earliest = obj.timespans
    .reduce((earliest, ts) => {
      return (earliest && earliest < ts.start) ? earliest : ts.start?.in;
    }, null);

  const latest = obj.timespans
    .reduce((latest, ts) => {
      return (latest && latest > ts.end) ? latest : ts.end?.in;
    }, null);

  return { earliest, latest };
}

const isValue = arg => 
  typeof arg === 'string' || arg instanceof String || !isNaN(arg);

export const parseWhen = arg => {

  if (!arg)
    return null;
  
  const {
    earliest,
    latest,
    year
  } = isValue(arg) ? parseValue(arg) : parseFull(arg);

  let label;

  if (earliest && latest) {
    label = `${earliest}-${latest}`;
  } else if (earliest) {
    label = `after ${earliest}`;
  } else if (latest) {
    label = `before ${latest}`;
  } else if (year) {
    label = String(year);
  }

  return {
    earliest: earliest || year,
    latest: latest || year,
    year,
    label
  }

}
