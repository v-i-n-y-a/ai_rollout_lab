export type EventKind = "view" | "click" | "feedback" | "summary_view";

export interface AppEvent {
  readonly id: string;
  readonly kind: EventKind;
  readonly subjectId: string;
  readonly userId?: string;
  readonly sessionId?: string;
  readonly payload?: Record<string, unknown>;
  readonly createdAt: string;
}
