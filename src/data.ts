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
    title: 'Senior Software Engineer, OpenText', period: 'Nov 2025 – Present', meta: 'Enterprise data platform', now: true,
    points: [
      'Fixed a page-freezing issue with virtual scroll, lazy loading and debounced input, so 35K+ records render smoothly.',
      'Designed frontend plus Redis caching that cut average API response time by up to 18%.',
      'Built a custom GitHub Copilot agent with team skills, and a RAG code assistant that cut boilerplate time by 25%.',
      'Rebuilt UI components in MUI and Tailwind; kept 85%+ unit test coverage across Node.js and Java services.',
    ],
    tags: ['Node.js', 'Java', 'Redis', 'MUI', 'Tailwind', 'Copilot Agent', 'RAG'],
  },
  {
    title: 'Tech Lead, Bajaj Finserv', period: 'Mar 2023 – Nov 2025', meta: 'Fintech · 110M+ users',
    points: [
      'Led and mentored 6 engineers on architecture, sprint planning and delivery.',
      'Shipped 6 business-critical full-stack modules across 20+ production releases.',
      'Built an Engineering CRM from scratch that the whole team adopted; cut API response time by up to 14%.',
      'Integrated Bajaj Pay SDK and SSO-based authentication.',
    ],
    tags: ['Node.js', 'PWA', 'Redis', 'SSO', 'Bajaj Pay SDK', 'CI/CD'],
  },
  {
    title: 'Senior Software Engineer, Chetu India', period: 'Oct 2021 – Mar 2023', meta: 'Enterprise solutions',
    points: [
      'Designed Node.js microservices and an offline-first Ionic mobile app with background sync.',
      'Integrated Stripe with OAuth 2.0 and JWT; load testing contributed to an 11% faster API response.',
    ],
    tags: ['Node.js', 'Ionic', 'Stripe', 'OAuth 2.0', 'JWT', 'Microservices'],
  },
  {
    title: 'Software Developer, VPGP (EasyNow)', period: 'Apr 2019 – Jun 2021',
    points: ['Built a full-stack CRM with role-based access, subscription tiers and Razorpay payments.'],
    tags: ['Node.js', 'Razorpay', 'RBAC', 'JWT', 'DB indexing'],
  },
  {
    title: 'Junior Software Developer, Fleet Solution', period: 'Sep 2018 – Apr 2019',
    points: ['Built responsive, accessible web apps and turned business requirements into features.'],
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
  { big: '−18%', title: 'Multi-layer caching', text: 'Frontend and Redis caching on a high-volume enterprise platform, cutting average API response time by up to 18%.', tags: ['Redis', 'Node.js', 'Performance'] },
  { big: '−25%', title: 'RAG code assistant', text: 'An internal assistant built with prompt engineering that cut boilerplate development time by 25%, plus a custom Copilot agent that follows team conventions.', tags: ['RAG', 'LLM', 'Copilot'] },
  { big: '35K+', title: 'Smooth large-data UI', text: 'Virtual scroll, lazy loading and debounced input removed a page-freezing issue when rendering 35K+ records.', tags: ['Frontend', 'MUI', 'Tailwind'] },
  { big: 'CRM', title: 'Engineering CRM', text: 'Built from scratch on Node.js with a frontend UI: sprint tracking, workflow automation and reporting. Adopted by the whole team.', tags: ['Node.js', 'Automation', 'Reporting'] },
  { big: 'Offline', title: 'Offline-first mobile app', text: 'Cross-platform Ionic app with a Node.js backend, local persistence and background sync for unreliable networks.', tags: ['Ionic', 'iOS / Android', 'Sync'] },
  { big: 'Pay', title: 'Payments and SSO', text: 'Secure integrations of Bajaj Pay SDK, Stripe and Razorpay, with OAuth 2.0, JWT and SSO-based authentication.', tags: ['Stripe', 'Razorpay', 'SSO'] },
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
