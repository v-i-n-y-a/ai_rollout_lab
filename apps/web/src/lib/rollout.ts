/**
 * Client-side flag evaluation: deterministic bucket 0–99 from identifier.
 * Must match API (apps/api/src/domain/rollout.ts) for consistent behavior.
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
