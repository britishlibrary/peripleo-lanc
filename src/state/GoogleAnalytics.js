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

    const randomId = (Math.random() + 1).toString(36).substring(7);
    console.log('Privacy-compliant tracking enabled. Random user id: ' + randomId);

    trackingEnabled = true;

    gtag('js',new Date());
    
    gtag('config', trackingId, { 
      client_storage: 'none', 
      storage: 'none', 
      anonymize_ip: true,
      client_id: randomId
    });

    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied'
    });  
  }
}

const tagSearch = search => {
  if (trackingEnabled) {
    const { query, filters, facet, total } = search;

    if (query || filters?.length > 0 || facet)
      gtag('event', 'search', { query, filters, facet, total: total });
  }
};

const tagSelection = id => {
  if (trackingEnabled) {
    gtag('event', 'selection', { id });
  }
}

export default { tagSearch, tagSelection, install };