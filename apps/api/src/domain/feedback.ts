export interface Feedback {
  readonly id: string;
  readonly subjectType: "summary" | "item";
  readonly subjectId: string;
  readonly rating: number;
  readonly comment?: string;
  readonly userId?: string;
  readonly createdAt: string;
}
