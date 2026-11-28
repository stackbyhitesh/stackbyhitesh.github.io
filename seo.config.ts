// Everything search engines read about the site, in one place.
// vite.config.ts uses this to write the structured data into the built page. Keep TITLE and DESCRIPTION in sync
// with the <title> and description meta tag in index.html (a quick way: search this repo for the old text).
import { faqs } from './src/faqs';

export const TITLE = 'Senior Full-Stack Software Engineer | Hitesh Chaudhari';
export const DESCRIPTION =
  'Senior full-stack software engineer and tech lead in Bengaluru, India. 8+ years building React, Node.js and TypeScript apps used by 110M+ people. Open to new full-time roles.';
export const SOCIAL_DESCRIPTION =
  'Senior full-stack software engineer and tech lead. React, Node.js, TypeScript, performance and AI-assisted development. Open to new full-time roles.';

export const buildJsonLd = (site: string) => {
  const person = `${site}#hitesh`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': person,
        name: 'Hitesh Chaudhari',
        url: site,
        image: `${site}og-image.png`,
        jobTitle: 'Senior Full-Stack Software Engineer',
        description: DESCRIPTION,
        worksFor: { '@type': 'Organization', name: 'OpenText' },
        address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
        homeLocation: { '@type': 'Place', name: 'Mumbai, India' },
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'University of Mumbai' },
        ],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Software Engineer',
          occupationLocation: { '@type': 'City', name: 'Bengaluru' },
          skills: 'React, Next.js, Angular, Node.js, TypeScript, REST APIs, GraphQL, microservices, Redis, AWS, performance engineering, RAG',
        },
        knowsAbout: [
          'Software engineering', 'Full-stack development', 'React', 'Next.js', 'Angular', 'Node.js', 'TypeScript',
          'REST APIs', 'GraphQL', 'Microservices', 'Performance engineering', 'AI-assisted development', 'Retrieval-augmented generation',
        ],
        sameAs: ['https://linkedin.com/in/eng-hitesh-chaudhari', 'https://stackbyhitesh.github.io/'],
      },
      {
        '@type': 'WebSite',
        '@id': `${site}#website`,
        url: site,
        name: 'Hitesh Chaudhari | Senior Full-Stack Software Engineer',
        inLanguage: 'en',
        publisher: { '@id': person },
      },
      {
        '@type': 'WebPage',
        '@id': `${site}#webpage`,
        url: site,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: 'en',
        isPartOf: { '@id': `${site}#website` },
        about: { '@id': person },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${site}og-image.png` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${site}#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
};
