import type { ItemSummary } from "../domain/item.js";

export interface SummaryRepository {
  getByItemId(itemId: string): Promise<ItemSummary | null>;
  save(summary: ItemSummary): Promise<void>;
}
