import type { RolloutFlag } from "../domain/flag.js";
import type { FlagRepository } from "../repositories/flag.repository.js";

const AI_SUMMARY_KEY = "ai_summary";

export class InMemoryFlagRepository implements FlagRepository {
  private readonly flags = new Map<string, RolloutFlag>([
    [
      AI_SUMMARY_KEY,
      {
        key: AI_SUMMARY_KEY,
        rolloutPercent: 50,
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  async get(key: string): Promise<RolloutFlag | null> {
    return this.flags.get(key) ?? null;
  }

  async set(flag: RolloutFlag): Promise<void> {
    this.flags.set(flag.key, flag);
  }

  async getAll(): Promise<readonly RolloutFlag[]> {
    return [...this.flags.values()];
  }
}
