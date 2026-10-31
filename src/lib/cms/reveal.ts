const listeners = new Set<() => void>();
let revealed: string | null = null;

export function peekReveal() {
  return revealed;
}

export function subscribeReveal(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function revealSurface(id: string | null) {
  if (revealed === id) return;
  revealed = id;
  listeners.forEach((listener) => listener());
}

export function clearReveal() {
  revealSurface(null);
}
