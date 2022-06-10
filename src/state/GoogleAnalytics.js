function gtag() {
  window.dataLayer.push(arguments);
}

let trackingEnabled = false;

const install = trackingId => {
  // Prevent multiple adds
  const scriptId = 'ga-gtag';
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'text/javascript';
  script.setAttribute('async', 'true');
  script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${trackingId}`);

  document.body.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];

    console.log('Traffic insight enabled');
    trackingEnabled = true;

    gtag('js',new Date());
    gtag('config', trackingId, { client_storage: 'none', anonymize_ip: true });      
  }
}

const tagSearch = search => {
  if (trackingEnabled) {
    console.log('Tagging search', search);

    const { query, filters, facet, total } = search;

    if (query || filters?.length > 0 || facet)
      gtag('event', 'search', { query, filters, facet, total: total });
  }
};

const tagSelection = id => {
  if (trackingEnabled) {
    console.log('Tagging selection', id);
    
    gtag('event', 'selection', { id });
  }
}

export default { tagSearch, tagSelection, install };