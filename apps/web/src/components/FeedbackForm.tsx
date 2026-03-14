import type React from "react";
import { useReducer } from "react";
import {
  feedbackFormReducer,
  initialFeedbackFormState
} from "../reducers/feedbackFormReducer";

export interface FeedbackFormProps {
  subjectType: "summary" | "item";
  onSubmit: (data: { rating: number; comment?: string }) => Promise<void>;
  submittedMessage?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  subjectType,
  onSubmit,
  submittedMessage = "Thanks for your feedback."
}) => {
  const [state, dispatch] = useReducer(feedbackFormReducer, initialFeedbackFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.rating < 1) return;
    onSubmit({ rating: state.rating, comment: state.comment || undefined }).then(() => {
      dispatch({ type: "SUBMIT_SUCCESS" });
    });
  };

  if (state.submitted) {
    return (
      <p className="feedback-thanks" data-cy="feedback-thanks">
        {submittedMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-group" data-cy="feedback-form">
      <label htmlFor="feedback-rating" className="form-group__label">
        Rate this {subjectType} (1–5):
      </label>
      <div className="form-row">
        <select
          id="feedback-rating"
          className="select"
          value={state.rating}
          onChange={(e) => dispatch({ type: "SET_RATING", payload: Number(e.target.value) })}
          required
          data-cy="feedback-rating"
        >
          <option value={0}>Choose</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="input"
          placeholder="Comment (optional)"
          value={state.comment}
          onChange={(e) => dispatch({ type: "SET_COMMENT", payload: e.target.value })}
          data-cy="feedback-comment"
        />
        <button type="submit" className="btn" data-cy="feedback-submit">
          Submit feedback
        </button>
      </div>
    </form>
  );
};
