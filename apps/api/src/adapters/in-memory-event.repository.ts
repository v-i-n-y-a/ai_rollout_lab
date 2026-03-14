import type { AppEvent } from "../domain/event.js";
import type { EventRepository } from "../repositories/event.repository.js";

export class InMemoryEventRepository implements EventRepository {
  private readonly events: AppEvent[] = [];

  async append(event: AppEvent): Promise<void> {
    this.events.push(event);
  }

  async list(kind?: string, limit = 100): Promise<readonly AppEvent[]> {
    let list = this.events;
    if (kind) list = list.filter((e) => e.kind === kind);
    return [...list].reverse().slice(0, limit);
  }

  async countByKind(kind: string): Promise<number> {
    return this.events.filter((e) => e.kind === kind).length;
  }
}
