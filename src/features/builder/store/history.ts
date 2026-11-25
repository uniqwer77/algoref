export const HISTORY_LIMIT = 100;
export const COALESCE_MS = 800;

export interface History<T> {
  past: T[];
  future: T[];
}

let lastKey: string | null = null;
let lastTime = 0;

export function resetCoalescing(): void {
  lastKey = null;
  lastTime = 0;
}

export function pushHistory<T>(history: History<T>, present: T, coalesceKey?: string): History<T> {
  const now = Date.now();
  const merge = !!coalesceKey && coalesceKey === lastKey && now - lastTime < COALESCE_MS;
  lastKey = coalesceKey ?? null;
  lastTime = now;

  if (merge) return { past: history.past, future: [] };
  return { past: [...history.past, present].slice(-HISTORY_LIMIT), future: [] };
}

export function undoHistory<T>(
  history: History<T>,
  present: T,
): { history: History<T>; present: T } | null {
  if (!history.past.length) return null;
  resetCoalescing();
  return {
    present: history.past[history.past.length - 1],
    history: { past: history.past.slice(0, -1), future: [present, ...history.future] },
  };
}

export function redoHistory<T>(
  history: History<T>,
  present: T,
): { history: History<T>; present: T } | null {
  if (!history.future.length) return null;
  resetCoalescing();
  const [next, ...rest] = history.future;
  return {
    present: next,
    history: { past: [...history.past, present], future: rest },
  };
}
