/** One entry in the command menu (Ctrl/⌘ + K). */
export interface Command {
  id: string;
  label: string;
  /** Small label on the right, for example "Go to" or "Link". */
  group: string;
  /** Extra search words that are not shown. */
  keywords?: string;
  run: () => void;
}

/** Keeps the commands that contain every word typed. Best matches (label starts with the text) come first. */
export function filterCommands(commands: readonly Command[], query: string): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...commands];
  const words = q.split(/\s+/);
  return commands
    .map((command) => {
      const label = command.label.toLowerCase();
      const haystack = `${label} ${command.group.toLowerCase()} ${command.keywords?.toLowerCase() ?? ''}`;
      if (!words.every((w) => haystack.includes(w))) return null;
      return { command, rank: label.startsWith(q) ? 0 : label.includes(q) ? 1 : 2 };
    })
    .filter((x): x is { command: Command; rank: number } => x !== null)
    .sort((a, b) => a.rank - b.rank)
    .map((x) => x.command);
}
