// All website content lives here. Edit this file to update the site.
import type { Achievement, Job, Pair, Profile, Project, Service, SkillGroup, Stat, Testimonial } from './types';

export const profile: Profile = {
  name: 'Hitesh Chaudhari',
  location: 'Bengaluru',
  hometown: 'Mumbai',
  email: 'chaudharihitesh57@gmail.com',
  phone: '+91 82689 46878',
  tel: '+918268946878',
  // WhatsApp opens with this message already typed.
  whatsapp: 'https://wa.me/918268946878?text=' + encodeURIComponent('Hi Hitesh, I came across your portfolio and would like to connect.'),
  linkedin: 'https://linkedin.com/in/eng-hitesh-chaudhari',
  // Optional: add full https links to show them automatically.
  github: '',    // e.g. 'https://github.com/your-username'
  calendar: '',  // e.g. 'https://cal.com/your-name/15min' adds a "Book a 15-min call" link
};

// ---------------------------------------------------------------------------------------------
// Contact form email (free). Messages are delivered straight to your inbox through Web3Forms,
// so visitors never need to open a mail app.
//   1. Go to https://web3forms.com, type chaudharihitesh57@gmail.com and press "Create Access Key".
//   2. They email you a key that looks like 1a2b3c4d-1234-5678-9abc-def012345678 (it is safe to publish).
//   3. Paste it between the quotes below, commit and push. (Or set a GitHub repository variable
//      named WEB3FORMS_KEY; the deploy workflow passes it in as VITE_WEB3FORMS_KEY.)
// Until a valid key is set, the form falls back to opening the visitor's mail app.
// ---------------------------------------------------------------------------------------------
export const WEB3FORMS_KEY: string = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) || '';

// Contact card people can save to their phone (file is in /public).
export const vcardUrl: string = `${import.meta.env.BASE_URL}hitesh-chaudhari.vcf`;

export const roles: string[] = [
  'Full-Stack Senior Software Engineer',
  'Tech Lead',
  'Forward Deployed Engineer',
  'AI-assisted developer',
];

export const navLinks: Pair[] = [
  ['about', 'About'],
  ['work', 'Experience'],
  ['projects', 'Projects'],
  ['achievements', 'Achievements'],
  ['skills', 'Skills'],
];
// Every section, in page order. Used by the command menu (Ctrl/⌘ + K).
export const sections: Pair[] = [
  ['about', 'About'],
  ['work', 'Experience'],
  ['process', 'How I work'],
  ['projects', 'Projects'],
  ['achievements', 'Achievements'],
  ['skills', 'Skills'],
  ['edu', 'Education'],
  ['contact', 'Contact'],
];
export const spyIds: string[] = ['about', 'work', 'process', 'projects', 'achievements', 'skills', 'edu', 'contact'];
export const spyMap: Record<string, string> = { process: 'work', edu: 'skills' };

export const badges: Pair[] = [
  ['110M+', 'users reached'],
  ['−18%', 'API response time'],
  ['85%+', 'test coverage'],
];

export const companies: string[] = ['OpenText', 'Bajaj Finserv', 'Chetu India', 'EasyNow', 'Fleet Solution'];

export const services: Service[] = [
  { icon: '⚡', title: 'Performance engineering', text: 'Multi-layer caching, query tuning and smooth rendering of large datasets.', result: 'Up to 18% faster API responses' },
  { icon: '👥', title: 'Tech leadership', text: 'Architecture decisions, sprint planning, code reviews and mentoring.', result: '6 engineers led, 20+ releases' },
  { icon: '🤝', title: 'Forward deployed delivery', text: 'Turning enterprise customer needs into working integrations.', result: 'Stripe, Razorpay, Bajaj Pay, SSO' },
  { icon: '🤖', title: 'AI-assisted development', text: 'Custom Copilot coding agents and RAG-based internal tooling.', result: '25% less boilerplate time' },
];

// Experience counter is calculated automatically (see src/lib/experience.js).
export const stats: Stat[] = [
  { n: 110, s: 'M+', label: 'users on modules I led' },
  { n: 20, s: '+', label: 'production releases' },
  { n: 35, s: 'K+', label: 'records rendered smoothly' },
];

export const jobs: Job[] = [
  {
    company: 'OpenText', role: 'Senior Software Engineer', meta: 'Enterprise data platform',
    period: 'Nov 2025 – Present', start: '2025-11', now: true,
    summary: 'I make a large enterprise data platform fast and smooth, and I build AI tools that help the team write code faster.',
    results: [
      { value: '−18%', label: 'API response time' },
      { value: '35K+', label: 'records shown smoothly' },
      { value: '−25%', label: 'repetitive coding time' },
      { value: '85%+', label: 'automated test coverage' },
    ],
    points: [
      'Fixed a screen that froze when showing 35,000+ records. It now stays smooth (using virtual scrolling, lazy loading and delayed input handling).',
      'Made the platform load data up to 18% faster by caching results in the browser and on the server (Redis).',
      "Built an AI coding assistant inside VS Code (GitHub Copilot) that follows the team's coding rules, and an internal AI tool (RAG) that cut repetitive coding time by 25%.",
      'Rebuilt key screens with Material UI and Tailwind CSS for a consistent, more accessible look.',
      'Keep the backend (Node.js and Java) reliable, with 85%+ automated test coverage and regular code reviews.',
    ],
    tags: ['Node.js', 'Java', 'Redis', 'MUI', 'Tailwind', 'Copilot Agent', 'RAG'],
  },
  {
    company: 'Bajaj Finserv', role: 'Tech Lead', meta: 'Fintech',
    period: 'Mar 2023 – Nov 2025', start: '2023-03', end: '2025-11',
    summary: 'I led a team of 6 engineers building modules used by over 110 million people, from planning to release.',
    results: [
      { value: '110M+', label: 'users on my modules' },
      { value: '6', label: 'engineers led' },
      { value: '20+', label: 'production releases' },
      { value: '−14%', label: 'API response time' },
    ],
    points: [
      'Led and mentored 6 engineers: planning sprints, making architecture decisions and delivering work for modules used by 110M+ users.',
      'Delivered 6 business-critical modules end to end (screens plus backend) across 20+ releases with minimal defects.',
      'Built an internal Engineering CRM from scratch to track sprints and automate workflows. The whole team adopted it.',
      'Sped up APIs by up to 14% with database indexing and caching (browser and Redis).',
      'Added secure payments (Bajaj Pay SDK) and single sign-on (SSO) login across core modules.',
    ],
    tags: ['Node.js', 'PWA', 'Redis', 'SSO', 'Bajaj Pay SDK', 'CI/CD'],
  },
  {
    company: 'Chetu India', role: 'Senior Software Engineer', meta: 'Enterprise solutions',
    period: 'Oct 2021 – Mar 2023', start: '2021-10', end: '2023-03',
    summary: 'I designed backend services for enterprise customers and built a mobile app that keeps working without internet.',
    results: [
      { value: 'Offline', label: 'mobile app that syncs later' },
      { value: '−11%', label: 'API response time' },
      { value: 'Stripe', label: 'secure online payments' },
    ],
    points: [
      'Designed scalable backend services (Node.js microservices) for enterprise customers.',
      'Built a mobile app (Ionic, iOS and Android) that keeps working offline and syncs when the connection returns.',
      'Added secure online payments with Stripe and safe login (OAuth 2.0, JWT).',
      'Load-tested the APIs and tuned them for 11% faster responses, keeping 85%+ test coverage.',
    ],
    tags: ['Node.js', 'Ionic', 'Stripe', 'OAuth 2.0', 'JWT', 'Microservices'],
  },
  {
    company: 'VPGP (EasyNow)', role: 'Software Developer',
    period: 'Apr 2019 – Jun 2021', start: '2019-04', end: '2021-06',
    summary: 'I built a complete customer-management system with role-based logins, subscription plans and online payments.',
    results: [
      { value: 'CRM', label: 'built from scratch' },
      { value: 'Razorpay', label: 'online payments' },
    ],
    points: [
      'Built a complete CRM (customer-management system) from scratch, with logins by role, to automate customer workflows.',
      "Added a user portfolio feature and subscription logins that unlock features based on each customer's plan.",
      'Added online payments with Razorpay and sped up the database with indexing.',
      'Designed responsive dashboards and the backend APIs, with automation that reduces manual and bulk work.',
    ],
    tags: ['Node.js', 'Razorpay', 'RBAC', 'JWT', 'DB indexing'],
  },
  {
    company: 'Fleet Solution', role: 'Junior Software Developer',
    period: 'Sep 2018 – Apr 2019', start: '2018-09', end: '2019-04',
    summary: 'My first role: building responsive, accessible websites and turning business needs into working features.',
    results: [{ value: 'Web apps', label: 'responsive and accessible' }],
    points: [
      'Built responsive websites that work across browsers and follow accessibility best practices.',
      'Worked with stakeholders to turn business requirements into working features.',
    ],
    tags: ['Responsive web', 'Accessibility', 'Cross-browser'],
  },
];

export const steps: Pair[] = [
  ['Understand', 'Translate customer and business requirements into a clear technical scope.'],
  ['Design', 'Plan scalable architecture and make the right trade-offs early.'],
  ['Build', 'Ship full-stack features with code reviews and 85%+ unit test coverage.'],
  ['Optimize', 'Fix caching, queries and rendering based on measured results.'],
  ['Support', 'Own CI/CD and production issues, and mentor the team.'],
];

export const projects: Project[] = [
  { big: '−18%', title: 'Multi-layer caching', text: 'Frontend and Redis caching on a high-volume enterprise platform, cutting average API response time by up to 18%.', tags: ['Redis', 'Node.js', 'Performance'], categories: ['Performance', 'Backend'] },
  { big: '−25%', title: 'RAG code assistant', text: 'An internal assistant built with prompt engineering that cut boilerplate development time by 25%, plus a custom Copilot agent that follows team conventions.', tags: ['RAG', 'LLM', 'Copilot'], categories: ['AI'] },
  { big: '35K+', title: 'Smooth large-data UI', text: 'Virtual scroll, lazy loading and debounced input removed a page-freezing issue when rendering 35K+ records.', tags: ['Frontend', 'MUI', 'Tailwind'], categories: ['Performance', 'Frontend'] },
  { big: 'CRM', title: 'Engineering CRM', text: 'Built from scratch on Node.js with a frontend UI: sprint tracking, workflow automation and reporting. Adopted by the whole team.', tags: ['Node.js', 'Automation', 'Reporting'], categories: ['Frontend', 'Backend'] },
  { big: 'Offline', title: 'Offline-first mobile app', text: 'Cross-platform Ionic app with a Node.js backend, local persistence and background sync for unreliable networks.', tags: ['Ionic', 'iOS / Android', 'Sync'], categories: ['Mobile', 'Backend'] },
  { big: 'Pay', title: 'Payments and SSO', text: 'Secure integrations of Bajaj Pay SDK, Stripe and Razorpay, with OAuth 2.0, JWT and SSO-based authentication.', tags: ['Stripe', 'Razorpay', 'SSO'], categories: ['Backend', 'Payments'] },
];

export const marquee: string[][] = [
  ['React', 'Angular', 'Next.js', 'TypeScript', 'Node.js', 'Java', 'PWA', 'Tailwind CSS', 'Material UI', 'GraphQL', 'Microservices'],
  ['Redis', 'PostgreSQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'RAG', 'LangChain', 'Copilot Agents', 'OAuth 2.0'],
];

export const skillGroups: SkillGroup[] = [
  { title: 'Frontend', tags: ['React', 'Angular', 'Next.js', 'TypeScript', 'RxJS', 'NgRx', 'Redux Toolkit', 'Module Federation'] },
  { title: 'Backend and APIs', tags: ['Node.js', 'Java', 'REST', 'GraphQL', 'Microservices'] },
  { title: 'AI-assisted development', tags: ['Copilot Agent mode', 'RAG', 'Vector DB', 'LangChain', 'LlamaIndex', 'OpenAI API', 'Anthropic API'] },
  { title: 'Data and cloud', tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'Azure', 'Docker', 'Kubernetes'] },
  { title: 'Payments and security', tags: ['Stripe', 'Razorpay', 'Bajaj Pay SDK', 'OAuth 2.0', 'JWT', 'SSO'] },
  { title: 'Quality and delivery', tags: ['Jasmine', 'Karma', 'JUnit', 'Cypress', 'TDD', 'SonarQube', 'CI/CD', 'Agile'] },
];

export const education: Pair[] = [
  ['MSc, Information Technology', 'University of Mumbai · 2019–2021'],
  ['BSc, Information Technology', 'Patkar College, University of Mumbai · 2015–2018'],
];

// Image for each award: add a file named after the slug to src/assets/achievements (for example prodigy.jpg).
export const achievements: Achievement[] = [
  { slug: 'heros', title: "Hero's Award", note: 'Awarded for engineering excellence' },
  { slug: 'prodigy', title: 'Prodigy Award', note: 'Awarded for engineering excellence' },
  { slug: 'super-achiever', title: 'Super Achiever Award', note: 'Awarded for engineering excellence' },
  { slug: 'tech-titan', title: 'Tech Titan Award', note: 'Awarded for engineering excellence' },
];

// Shown as small tags in the contact section.
export const topics: string[] = ['Frontend performance', 'AI-assisted development', 'Engineering leadership'];

// Options in the "What's it about?" menu of the contact form.
export const topicOptions: string[] = ['Just saying hello', 'A project idea', 'Collaboration', 'A question about my work', 'Something else'];

// Optional: add quotes (for example from LinkedIn recommendations, with permission) and a section appears.
// Example: { quote: 'Hitesh made our dashboard fast again.', name: 'Name Surname', role: 'Role, Company' }
export const testimonials: Testimonial[] = [];
