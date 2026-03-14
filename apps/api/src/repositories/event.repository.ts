import type { AppEvent } from "../domain/event.js";

export interface EventRepository {
  append(event: AppEvent): Promise<void>;
  list(kind?: string, limit?: number): Promise<readonly AppEvent[]>;
  countByKind(kind: string): Promise<number>;
}
