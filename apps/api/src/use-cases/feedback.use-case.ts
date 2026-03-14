import type { Feedback } from "../domain/feedback.js";
import type { FeedbackRepository } from "../repositories/feedback.repository.js";

export interface SubmitFeedbackInput {
  subjectType: "summary" | "item";
  subjectId: string;
  rating: number;
  comment?: string;
  userId?: string;
}

export class FeedbackUseCase {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}

  async submit(input: SubmitFeedbackInput, idGenerator: () => string): Promise<Feedback> {
    const feedback: Feedback = {
      id: idGenerator(),
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      rating: input.rating,
      comment: input.comment,
      userId: input.userId,
      createdAt: new Date().toISOString()
    };
    await this.feedbackRepo.save(feedback);
    return feedback;
  }
}
