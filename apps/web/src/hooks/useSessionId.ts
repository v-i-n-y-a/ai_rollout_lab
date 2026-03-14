import { useMemo } from "react";
import { getSessionId } from "../sessionId";

export function useSessionId(): string {
  return useMemo(getSessionId, []);
}
