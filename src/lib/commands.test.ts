import { describe, expect, it } from 'vitest';
import { filterCommands, type Command } from './commands';

const run = () => {};
const commands: Command[] = [
  { id: 'a', label: 'Go to Projects', group: 'Go to', run },
  { id: 'b', label: 'Copy email address', group: 'Action', keywords: 'mail gmail', run },
  { id: 'c', label: 'Open LinkedIn', group: 'Link', keywords: 'social profile', run },
  { id: 'd', label: 'Projects overview', group: 'Link', run },
];

describe('filterCommands', () => {
  it('returns everything for an empty query', () => expect(filterCommands(commands, '  ')).toHaveLength(4));
  it('matches on label, group and hidden keywords', () => {
    expect(filterCommands(commands, 'gmail').map((c) => c.id)).toEqual(['b']);
    expect(filterCommands(commands, 'social').map((c) => c.id)).toEqual(['c']);
  });
  it('needs every typed word to match', () => {
    expect(filterCommands(commands, 'copy linkedin')).toEqual([]);
    expect(filterCommands(commands, 'go projects').map((c) => c.id)).toEqual(['a']);
  });
  it('puts labels that start with the text first', () => {
    expect(filterCommands(commands, 'projects').map((c) => c.id)).toEqual(['d', 'a']);
  });
});
