import type { Feedback } from "../domain/feedback.js";

export interface FeedbackRepository {
  save(feedback: Feedback): Promise<void>;
  listBySubject(subjectType: string, subjectId: string): Promise<readonly Feedback[]>;
}
