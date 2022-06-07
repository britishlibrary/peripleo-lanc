import { gtag, install } from 'ga-gtag';

const tag = search => {
  try {
    if (search?.query) {
      console.log('tagging', search);
      gtag('event', 'search', { query: search.query });
    }
  } catch (error) {
    // Just a hack
  }
};

export default { tag, install };