import {
  feedbackFormReducer,
  initialFeedbackFormState,
} from "../feedbackFormReducer";

describe("feedbackFormReducer", () => {
  it("returns initial state", () => {
    expect(initialFeedbackFormState).toEqual({
      rating: 0,
      comment: "",
      submitted: false,
    });
  });

  it("SET_RATING updates rating", () => {
    const state = feedbackFormReducer(initialFeedbackFormState, {
      type: "SET_RATING",
      payload: 4,
    });
    expect(state.rating).toBe(4);
    expect(state.comment).toBe("");
    expect(state.submitted).toBe(false);
  });

  it("SET_COMMENT updates comment", () => {
    const state = feedbackFormReducer(initialFeedbackFormState, {
      type: "SET_COMMENT",
      payload: "Great summary",
    });
    expect(state.comment).toBe("Great summary");
    expect(state.rating).toBe(0);
  });

  it("SUBMIT_SUCCESS sets submitted to true", () => {
    const withRating = feedbackFormReducer(initialFeedbackFormState, {
      type: "SET_RATING",
      payload: 5,
    });
    const state = feedbackFormReducer(withRating, { type: "SUBMIT_SUCCESS" });
    expect(state.submitted).toBe(true);
    expect(state.rating).toBe(5);
  });

  it("RESET restores initial state", () => {
    const filled = feedbackFormReducer(
      feedbackFormReducer(initialFeedbackFormState, { type: "SET_RATING", payload: 3 }),
      { type: "SET_COMMENT", payload: "ok" }
    );
    const state = feedbackFormReducer(filled, { type: "RESET" });
    expect(state).toEqual(initialFeedbackFormState);
  });
});
