import { renderHook, waitFor } from "@testing-library/react";
import { useSummary } from "../useSummary";
import { api } from "../../api/client";

jest.mock("../../api/client", () => ({
  api: {
    getSummary: jest.fn(),
  },
}));

const mockGetSummary = api.getSummary as jest.MockedFunction<typeof api.getSummary>;

describe("useSummary", () => {
  beforeEach(() => {
    mockGetSummary.mockReset();
  });

  it("starts with loading true", () => {
    mockGetSummary.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useSummary("item-1", "session-1"));
    expect(result.current.loading).toBe(true);
    expect(result.current.summary).toBeNull();
    expect(result.current.inRollout).toBe(false);
  });

  it("sets summary and inRollout when getSummary resolves", async () => {
    mockGetSummary.mockResolvedValue({
      summary: { itemId: "item-1", summary: "A short summary.", generatedAt: "2025-01-01T00:00:00Z" },
      inRollout: true,
    });
    const { result } = renderHook(() => useSummary("item-1", "session-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.summary).toBe("A short summary.");
    expect(result.current.inRollout).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("sets error when getSummary rejects", async () => {
    mockGetSummary.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useSummary("item-1", "session-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBeNull();
    expect(result.current.summary).toBeNull();
  });

  it("does not call getSummary when itemId is undefined", () => {
    renderHook(() => useSummary(undefined, "session-1"));
    expect(mockGetSummary).not.toHaveBeenCalled();
  });
});
