import { getDescriptions } from "../store";

/**
 * Dynamically inserts structured SEO data for a selected item.
 * 
 * <script type="application/ld+json">
 * {
 *   "@context": "https://schema.org/",
 *   "@type": "Recipe",
 *   "name": "Party Coffee Cake",
 *   "author": {
 *     "@type": "Person",
 *     "name": "Mary Stone"
 *   },
 *   "datePublished": "2018-03-10",
 *   "description": "This coffee cake is awesome and perfect for parties.",
 *   "prepTime": "PT20M"
 * }
 * </script>
 */
export const insertSeoData = item => {  
  const seoData = {
    '@context': 'https://schema.org/',
    '@type': item.properties?.type || item.type,
    'name': item.title,
    'description': getDescriptions(item).join('\n')
  }

  const outdated = document.querySelector('script[type="application/ld+json"]');
  if (outdated)
    outdated.parentNode.removeChild(outdated);

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(seoData, null, 2);

  document.head.appendChild(script);
};