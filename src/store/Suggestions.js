import { getDescriptions } from '.';

const escapeRegex = str =>
  str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

export const getSuggestedTerms = (query, hits) => {
  const titles = hits.map(hit => hit.title).join(' ');
  const descriptions = hits.map(getDescriptions).join(' ');

  const regex = new RegExp('([^(\\s|\()|,])*' + escapeRegex(query) + '([^(\\s|.|,|;|:)]*)?', 'gi');
  const matches = (titles + ' ' + descriptions).matchAll(regex);

  let matchedTerms = []
  for (const match of matches) {
    const m = match[0].toLowerCase();
    if (matchedTerms.indexOf(m) === -1)
      matchedTerms.push(m);
  }

  return matchedTerms.slice(0, 3);
}