// Questions clients ask before hiring a freelance engineer. These are shown on the page (FAQ section) and also
// sent to search engines as FAQ structured data, so keep the answers short, factual and true.
// This file must not import anything, because the build config reads it too.
export interface Faq { q: string; a: string }

export const faqs: Faq[] = [
  {
    q: 'Are you available for freelance software engineering work?',
    a: "Yes. I'm open to freelance and contract full-stack projects, from new web apps and APIs to performance work on an existing product. Send a short note through the contact form, email or WhatsApp with what you're building, your timeline and your budget range, and we can take it from there.",
  },
  {
    q: 'What can a freelance full-stack engineer like you build?',
    a: 'Web apps and dashboards in React, Next.js or Angular, backed by Node.js and TypeScript REST or GraphQL APIs and microservices. I have also built offline-first hybrid mobile apps with Ionic, integrated payments (Stripe, Razorpay) and single sign-on, and shipped AI features such as RAG assistants and LLM-powered tooling.',
  },
  {
    q: 'How much experience do you have?',
    a: '8+ years building web and mobile products, including a platform used by 110M+ people. I have worked as a senior software engineer and tech lead, led a team of 6, and shipped 20+ production releases in fintech and enterprise settings.',
  },
  {
    q: 'Can you speed up a slow web app or API?',
    a: 'Yes, performance is a speciality. I have cut average API response times by up to 18% with multi-layer caching (Redis plus frontend caching) and query and index tuning, and fixed a page that froze on 35K+ records using virtual scrolling, lazy loading and debounced input.',
  },
  {
    q: 'Do you build AI-powered features?',
    a: 'Yes. I build RAG-based assistants and custom coding agents (GitHub Copilot agent mode) and work with the OpenAI and Anthropic APIs, vector databases, LangChain and LlamaIndex. A RAG code assistant I built cut boilerplate development time by 25%.',
  },
  {
    q: 'Where are you based, and which time zone do you work in?',
    a: "I'm based in Bengaluru, India (IST, UTC+5:30), with Mumbai as my hometown. I'm happy to find overlap with your working hours.",
  },
];
