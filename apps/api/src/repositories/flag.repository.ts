import type { RolloutFlag } from "../domain/flag.js";

export interface FlagRepository {
  get(key: string): Promise<RolloutFlag | null>;
  set(flag: RolloutFlag): Promise<void>;
  getAll(): Promise<readonly RolloutFlag[]>;
}
