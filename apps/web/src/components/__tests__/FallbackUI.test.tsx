import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FallbackUI } from "../FallbackUI";

describe("FallbackUI", () => {
  it("renders default title and message", () => {
    render(<FallbackUI />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Please try again.")).toBeInTheDocument();
  });

  it("renders custom title and message", () => {
    render(
      <FallbackUI title="Load failed" message="Could not load summary." />
    );
    expect(screen.getByText("Load failed")).toBeInTheDocument();
    expect(screen.getByText("Could not load summary.")).toBeInTheDocument();
  });

  it("calls onRetry when Retry is clicked", async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup();
    render(<FallbackUI onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render Retry button when onRetry is not provided", () => {
    render(<FallbackUI />);
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
  });
});
