import type { Item } from "../domain/item.js";

export interface ItemRepository {
  list(limit: number, offset: number): Promise<readonly Item[]>;
  getById(id: string): Promise<Item | null>;
}
