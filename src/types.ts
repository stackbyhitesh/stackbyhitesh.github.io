/** Shared types for the content in `src/data.ts`. */

export interface Profile {
  name: string;
  location: string;
  hometown: string;
  email: string;
  phone: string;
  tel: string;
  whatsapp: string;
  linkedin: string;
  /** Optional. Leave empty to hide. */
  github: string;
  /** Optional booking link. Leave empty to hide. */
  calendar: string;
}

/** A pair of strings, for example [title, description]. */
export type Pair = readonly [string, string];

export interface Service {
  icon: string;
  title: string;
  text: string;
  result: string;
}

export interface Stat {
  n: number;
  s: string;
  label: string;
}

export interface JobResult {
  /** Big number or word, for example "−18%" */
  value: string;
  /** Plain-language label, for example "faster API responses" */
  label: string;
}

export interface Job {
  company: string;
  role: string;
  /** Short extra line, for example "Fintech · 110M+ users" */
  meta?: string;
  /** Dates as shown on the card, for example "Nov 2025 – Present" */
  period: string;
  /** "YYYY-MM". Used for the career chart and the duration. */
  start: string;
  /** "YYYY-MM". Leave out for the current job. */
  end?: string;
  now?: boolean;
  /** One plain-language sentence that explains the role. */
  summary: string;
  /** The headline results, shown as big numbers. */
  results: JobResult[];
  /** Details, shown when "What I did" is opened. */
  points: string[];
  tags: string[];
}

export interface Project {
  big: string;
  title: string;
  text: string;
  tags: string[];
  /** Used by the filter buttons in the Projects section. A project can be in several categories. */
  categories: string[];
}

export interface SkillGroup {
  title: string;
  tags: string[];
}

export interface Achievement {
  /** File name (without extension) of the image in src/assets/achievements. */
  slug: string;
  title: string;
  note: string;
  /** Optional exact file name in src/assets/achievements (for example 'IMG_1234.jpg') if it does not follow the naming rule. */
  file?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export type Theme = 'dark' | 'light';
