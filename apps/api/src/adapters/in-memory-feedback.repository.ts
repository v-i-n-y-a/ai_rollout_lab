import type { Feedback } from "../domain/feedback.js";
import type { FeedbackRepository } from "../repositories/feedback.repository.js";

export class InMemoryFeedbackRepository implements FeedbackRepository {
  private readonly list: Feedback[] = [];

  async save(feedback: Feedback): Promise<void> {
    this.list.push(feedback);
  }

  async listBySubject(
    subjectType: string,
    subjectId: string
  ): Promise<readonly Feedback[]> {
    return this.list.filter(
      (f) => f.subjectType === subjectType && f.subjectId === subjectId
    );
  }
}
