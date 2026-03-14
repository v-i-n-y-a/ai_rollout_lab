import { renderHook } from "@testing-library/react";
import { useSessionId } from "../useSessionId";

describe("useSessionId", () => {
  const key = "ai_rollout_session_id";

  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns a string", () => {
    const { result } = renderHook(() => useSessionId());
    expect(typeof result.current).toBe("string");
    expect(result.current.length).toBeGreaterThan(0);
  });

  it("persists same id in sessionStorage", () => {
    const { result } = renderHook(() => useSessionId());
    expect(sessionStorage.getItem(key)).toBe(result.current);
  });

  it("returns same value on re-renders (memoized)", () => {
    const { result, rerender } = renderHook(() => useSessionId());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
