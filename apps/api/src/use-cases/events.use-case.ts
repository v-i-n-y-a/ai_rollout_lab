import type { AppEvent, EventKind } from "../domain/event.js";
import type { EventRepository } from "../repositories/event.repository.js";

export interface LogEventInput {
  kind: EventKind;
  subjectId: string;
  userId?: string;
  sessionId?: string;
  payload?: Record<string, unknown>;
}

export interface MetricsResult {
  byKind: Record<string, number>;
  total: number;
}

export class EventsUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  async log(input: LogEventInput, idGenerator: () => string): Promise<AppEvent> {
    const event: AppEvent = {
      id: idGenerator(),
      kind: input.kind,
      subjectId: input.subjectId,
      userId: input.userId,
      sessionId: input.sessionId,
      payload: input.payload,
      createdAt: new Date().toISOString()
    };
    await this.eventRepo.append(event);
    return event;
  }

  async getMetrics(): Promise<MetricsResult> {
    const kinds: EventKind[] = ["view", "click", "feedback", "summary_view"];
    const byKind: Record<string, number> = {};
    let total = 0;
    for (const kind of kinds) {
      const count = await this.eventRepo.countByKind(kind);
      byKind[kind] = count;
      total += count;
    }
    return { byKind, total };
  }

  async list(kind?: string, limit?: number): Promise<readonly AppEvent[]> {
    return this.eventRepo.list(kind, limit);
  }
}
