import { useEffect, useState } from "react";
import { api } from "../api/client";

export interface SummaryState {
  summary: string | null;
  inRollout: boolean;
  loading: boolean;
  error: Error | null;
}

export function useSummary(itemId: string | undefined, sessionId: string): SummaryState {
  const [state, setState] = useState<SummaryState>({
    summary: null,
    inRollout: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!itemId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .getSummary(itemId, sessionId)
      .then((r) => {
        setState({
          summary: r.summary?.summary ?? null,
          inRollout: r.inRollout,
          loading: false,
          error: null
        });
      })
      .catch((err) => {
        setState({
          summary: null,
          inRollout: false,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err))
        });
      });
  }, [itemId, sessionId]);

  return state;
}
