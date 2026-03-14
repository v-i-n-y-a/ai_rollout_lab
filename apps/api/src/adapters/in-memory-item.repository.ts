import type { Item } from "../domain/item.js";
import type { ItemRepository } from "../repositories/item.repository.js";

const SEED_ITEMS: Item[] = [
  {
    id: "1",
    title: "Getting started with feature flags",
    description:
      "Learn how to safely roll out features using percentage rollouts and user targeting.",
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "AI summarization best practices",
    description:
      "When and how to expose AI-generated summaries to users without overwhelming them.",
    createdAt: "2025-01-16T10:00:00Z"
  },
  {
    id: "3",
    title: "Feedback loops for ML products",
    description:
      "Collect and use feedback to improve model quality and product decisions.",
    createdAt: "2025-01-17T10:00:00Z"
  },
  {
    id: "4",
    title: "Event pipelines at scale",
    description:
      "Design event logging and metrics so you can measure rollout impact.",
    createdAt: "2025-01-18T10:00:00Z"
  },
  {
    id: "5",
    title: "Admin controls and guardrails",
    description:
      "Safe admin endpoints for flag updates, kill switches, and rollbacks.",
    createdAt: "2025-01-19T10:00:00Z"
  }
];

export class InMemoryItemRepository implements ItemRepository {
  private readonly items = new Map<string, Item>(
    SEED_ITEMS.map((i) => [i.id, i])
  );

  async list(limit: number, offset: number): Promise<readonly Item[]> {
    const list = [...this.items.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return list.slice(offset, offset + limit);
  }

  async getById(id: string): Promise<Item | null> {
    return this.items.get(id) ?? null;
  }
}
