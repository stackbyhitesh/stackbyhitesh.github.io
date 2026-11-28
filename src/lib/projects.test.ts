import { describe, expect, it } from 'vitest';
import { ALL, filterProjects, projectCategories } from './projects';
import type { Project } from '../types';

const p = (title: string, categories: string[]): Project => ({ big: '', title, text: '', tags: [], categories });
const projects = [p('one', ['Performance', 'Backend']), p('two', ['AI']), p('three', ['Performance', 'Frontend'])];

describe('projectCategories', () => {
  it('lists All first, then categories in order of appearance without duplicates', () => {
    expect(projectCategories(projects)).toEqual([ALL, 'Performance', 'Backend', 'AI', 'Frontend']);
  });
});

describe('filterProjects', () => {
  it('returns everything for All', () => expect(filterProjects(projects, ALL)).toHaveLength(3));
  it('keeps projects that belong to the category (including multi-category ones)', () => {
    expect(filterProjects(projects, 'Performance').map((x) => x.title)).toEqual(['one', 'three']);
    expect(filterProjects(projects, 'AI').map((x) => x.title)).toEqual(['two']);
  });
  it('returns an empty list for an unknown category', () => expect(filterProjects(projects, 'Nope')).toEqual([]));
});
