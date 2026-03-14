import type { ItemSummary } from "../domain/item.js";
import { isInRollout } from "../domain/rollout.js";
import type { FlagRepository } from "../repositories/flag.repository.js";
import type { ItemRepository } from "../repositories/item.repository.js";
import type { SummaryRepository } from "../repositories/summary.repository.js";

const AI_SUMMARY_FLAG_KEY = "ai_summary";

export interface GetSummaryInput {
  itemId: string;
  userId?: string;
  sessionId: string;
}

export interface GetSummaryResult {
  summary: ItemSummary | null;
  inRollout: boolean;
}

export class SummaryUseCase {
  constructor(
    private readonly itemRepo: ItemRepository,
    private readonly summaryRepo: SummaryRepository,
    private readonly flagRepo: FlagRepository
  ) {}

  async getSummary(input: GetSummaryInput): Promise<GetSummaryResult> {
    const item = await this.itemRepo.getById(input.itemId);
    if (!item) return { summary: null, inRollout: false };

    const flag = await this.flagRepo.get(AI_SUMMARY_FLAG_KEY);
    const rolloutPercent = flag?.rolloutPercent ?? 0;
    const identifier = input.userId ?? input.sessionId;
    const inRollout = isInRollout(identifier, rolloutPercent);

    if (!inRollout) return { summary: null, inRollout: false };

    const summary = await this.summaryRepo.getByItemId(input.itemId);
    return { summary, inRollout: true };
  }
}
