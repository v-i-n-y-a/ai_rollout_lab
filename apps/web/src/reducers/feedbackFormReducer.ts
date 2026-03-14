export type FeedbackFormAction =
  | { type: "SET_RATING"; payload: number }
  | { type: "SET_COMMENT"; payload: string }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "RESET" };

export interface FeedbackFormState {
  rating: number;
  comment: string;
  submitted: boolean;
}

export const initialFeedbackFormState: FeedbackFormState = {
  rating: 0,
  comment: "",
  submitted: false
};

export function feedbackFormReducer(
  state: FeedbackFormState,
  action: FeedbackFormAction
): FeedbackFormState {
  switch (action.type) {
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "SET_COMMENT":
      return { ...state, comment: action.payload };
    case "SUBMIT_SUCCESS":
      return { ...state, submitted: true };
    case "RESET":
      return initialFeedbackFormState;
    default:
      return state;
  }
}
