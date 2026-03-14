export type FlagName = "analytics" | "beta-ui" | "debug-logging";

export interface FlagContext {
  readonly userId?: string;
  readonly environment: "local" | "staging" | "production";
}

export interface FlagConfig {
  readonly name: FlagName;
  readonly enabled: boolean;
}

const defaultFlags: ReadonlyArray<FlagConfig> = [
  { name: "analytics", enabled: true },
  { name: "beta-ui", enabled: false },
  { name: "debug-logging", enabled: false }
];

export const isFlagEnabled = (
  flag: FlagName,
  _context: FlagContext
): boolean => {
  return defaultFlags.some((f) => f.name === flag && f.enabled);
};
