/**
 * Deterministic bucket 0–99 from a string (e.g. userId or sessionId).
 * Used to decide if a user is in a rollout percentage.
 */
export function rolloutBucket(identifier: string): number {
  let h = 0;
  for (let i = 0; i < identifier.length; i++) {
    h = (h * 31 + identifier.charCodeAt(i)) >>> 0;
  }
  return h % 100;
}

export function isInRollout(identifier: string, rolloutPercent: number): boolean {
  if (rolloutPercent <= 0) return false;
  if (rolloutPercent >= 100) return true;
  return rolloutBucket(identifier) < rolloutPercent;
}
