// Everything search engines read about the site, in one place.
// vite.config.ts uses this to write the structured data into the built page. Keep TITLE and DESCRIPTION in sync
// with the <title> and description meta tag in index.html (a quick way: search this repo for the old text).
import { faqs } from './src/faqs';

export const TITLE = 'Freelance Full-Stack Software Engineer | Hitesh Chaudhari';
export const DESCRIPTION =
  'Freelance full-stack software engineer in Bengaluru, India. 8+ years building React, Node.js and TypeScript apps used by 110M+ people. Open to projects.';
export const SOCIAL_DESCRIPTION =
  'Freelance full-stack software engineer and tech lead. React, Node.js, TypeScript, performance and AI-assisted development for startups and enterprises.';

/** Services shown to Google as what this person offers. Keep these true to the work on the site. */
const SERVICES = [
  'Freelance full-stack web application development',
  'React, Next.js and Angular frontend development',
  'Node.js and TypeScript API and microservices development',
  'Web performance and API optimisation',
  'Payment gateway and single sign-on integration',
  'AI-assisted development: RAG assistants and LLM tooling',
  'Technical leadership and code review',
];

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
        jobTitle: 'Freelance Full-Stack Software Engineer',
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
          'Freelance software engineering', 'Full-stack development', 'React', 'Next.js', 'Angular', 'Node.js', 'TypeScript',
          'REST APIs', 'GraphQL', 'Microservices', 'Performance engineering', 'AI-assisted development', 'Retrieval-augmented generation',
        ],
        sameAs: ['https://linkedin.com/in/eng-hitesh-chaudhari', 'https://stackbyhitesh.github.io/'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${site}#service`,
        name: 'Hitesh Chaudhari | Freelance Software Engineering',
        url: site,
        image: `${site}og-image.png`,
        description: DESCRIPTION,
        provider: { '@id': person },
        founder: { '@id': person },
        address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
        areaServed: [{ '@type': 'Country', name: 'India' }, 'Remote (worldwide)'],
        availableLanguage: ['English'],
        serviceType: 'Freelance software engineering',
        knowsAbout: ['React', 'Node.js', 'TypeScript', 'Full-stack development', 'Performance engineering'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Freelance software engineering services',
          itemListElement: SERVICES.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${site}#website`,
        url: site,
        name: 'Hitesh Chaudhari | Freelance Software Engineer',
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
