import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackForm } from "../FeedbackForm";

describe("FeedbackForm", () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    onSubmit.mockClear();
  });

  it("renders rating select and comment input", () => {
    render(
      <FeedbackForm subjectType="summary" onSubmit={onSubmit} />
    );
    expect(screen.getByLabelText(/rate this summary/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/comment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit feedback/i })).toBeInTheDocument();
  });

  it("dispatches rating and comment on submit", async () => {
    const user = userEvent.setup();
    render(
      <FeedbackForm subjectType="summary" onSubmit={onSubmit} />
    );
    await user.selectOptions(screen.getByRole("combobox"), "4");
    await user.type(screen.getByPlaceholderText(/comment/i), "Very helpful");
    await user.click(screen.getByRole("button", { name: /submit feedback/i }));
    expect(onSubmit).toHaveBeenCalledWith({ rating: 4, comment: "Very helpful" });
  });

  it("shows thanks message after successful submit", async () => {
    const user = userEvent.setup();
    render(
      <FeedbackForm subjectType="summary" onSubmit={onSubmit} submittedMessage="Thank you!" />
    );
    await user.selectOptions(screen.getByRole("combobox"), "5");
    await user.click(screen.getByRole("button", { name: /submit feedback/i }));
    await screen.findByText("Thank you!");
    expect(screen.queryByRole("button", { name: /submit feedback/i })).not.toBeInTheDocument();
  });

  it("uses reducer for rating and comment", async () => {
    const user = userEvent.setup();
    render(
      <FeedbackForm subjectType="item" onSubmit={onSubmit} />
    );
    await user.selectOptions(screen.getByRole("combobox"), "3");
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("3");
    await user.type(screen.getByPlaceholderText(/comment/i), "ok");
    expect(screen.getByPlaceholderText(/comment/i)).toHaveValue("ok");
  });
});
