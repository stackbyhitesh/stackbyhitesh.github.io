import type { Project } from '../types';

export const ALL = 'All';

/** Filter button labels: "All" first, then each category in the order it first appears. */
export function projectCategories(projects: readonly Project[]): string[] {
  return [ALL, ...new Set(projects.flatMap((p) => p.categories))];
}

export function filterProjects(projects: readonly Project[], category: string): Project[] {
  return category === ALL ? [...projects] : projects.filter((p) => p.categories.includes(category));
}
