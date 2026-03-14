import type { ItemSummary } from "../domain/item.js";
import type { SummaryRepository } from "../repositories/summary.repository.js";

const SEED_SUMMARIES: ItemSummary[] = [
  {
    itemId: "1",
    summary:
      "A practical guide to feature flags: use percentage rollouts and user segments to ship safely and measure impact before full release.",
    generatedAt: "2025-01-15T11:00:00Z"
  },
  {
    itemId: "2",
    summary:
      "Best practices for AI summaries: show them only when they add value, and use feature flags to control exposure and collect feedback.",
    generatedAt: "2025-01-16T11:00:00Z"
  },
  {
    itemId: "3",
    summary:
      "Closing the loop: collect ratings and comments on AI outputs, then use that data to improve models and product decisions.",
    generatedAt: "2025-01-17T11:00:00Z"
  },
  {
    itemId: "4",
    summary:
      "Event pipelines: log views, clicks, and feedback so you can measure rollout success and debug issues quickly.",
    generatedAt: "2025-01-18T11:00:00Z"
  },
  {
    itemId: "5",
    summary:
      "Admin tooling: secure endpoints to update flags, adjust rollout percentages, and roll back when needed.",
    generatedAt: "2025-01-19T11:00:00Z"
  }
];

export class InMemorySummaryRepository implements SummaryRepository {
  private readonly byItemId = new Map<string, ItemSummary>(
    SEED_SUMMARIES.map((s) => [s.itemId, s])
  );

  async getByItemId(itemId: string): Promise<ItemSummary | null> {
    return this.byItemId.get(itemId) ?? null;
  }

  async save(summary: ItemSummary): Promise<void> {
    this.byItemId.set(summary.itemId, summary);
  }
}
