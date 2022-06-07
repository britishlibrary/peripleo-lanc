import { gtag, install } from 'ga-gtag';

const tag = search => {
  if (search?.query) {
    console.log('tagging', search);
    gtag('event', 'search', { query: search.query });
  }
};

export default { tag, install };