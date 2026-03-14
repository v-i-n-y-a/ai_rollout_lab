import type { RolloutFlag } from "../domain/flag.js";
import type { FlagRepository } from "../repositories/flag.repository.js";

export interface UpdateFlagInput {
  key: string;
  rolloutPercent: number;
}

export class FlagsUseCase {
  constructor(private readonly flagRepo: FlagRepository) {}

  async getAll(): Promise<readonly RolloutFlag[]> {
    return this.flagRepo.getAll();
  }

  async update(input: UpdateFlagInput): Promise<RolloutFlag> {
    const flag: RolloutFlag = {
      key: input.key,
      rolloutPercent: Math.max(0, Math.min(100, input.rolloutPercent)),
      updatedAt: new Date().toISOString()
    };
    await this.flagRepo.set(flag);
    return flag;
  }
}
