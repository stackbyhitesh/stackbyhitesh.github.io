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

export interface Job {
  title: string;
  period: string;
  meta?: string;
  now?: boolean;
  points: string[];
  tags: string[];
}

export interface Project {
  big: string;
  title: string;
  text: string;
  tags: string[];
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
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export type Theme = 'dark' | 'light';
