// import { gtag, install } from 'ga-gtag';

function gtag() {
  window.dataLayer.push(arguments);
}

const install = trackingId => {
  const scriptId = 'ga-gtag';

  // Avoid multiple adds
  if (document.getElementById(scriptId)) return;

  const script = document.createElement("script");
  script.id = scriptId;
  script.type = "text/javascript";
  script.setAttribute('async', 'true');
  script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${trackingId}`);
  document.body.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    gtag('js',new Date());
    gtag('config', trackingId);      
  }
}

const tag = search => {
  try {
    if (search?.query) {
      console.log('tagging', search);
      gtag('event', 'search', { query: search.query });
    }
  } catch (error) {
    console.log('Error');
    console.log(error);
  }
};

export default { tag, install };