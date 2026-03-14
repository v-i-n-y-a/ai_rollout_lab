import type { Item } from "../domain/item.js";
import type { ItemRepository } from "../repositories/item.repository.js";

export interface ListItemsResult {
  items: readonly Item[];
}

export class ItemsUseCase {
  constructor(private readonly itemRepo: ItemRepository) {}

  async list(limit: number, offset: number): Promise<ListItemsResult> {
    const items = await this.itemRepo.list(limit, offset);
    return { items };
  }

  async getById(id: string): Promise<Item | null> {
    return this.itemRepo.getById(id);
  }
}
