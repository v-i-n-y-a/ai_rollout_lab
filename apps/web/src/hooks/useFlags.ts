import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { RolloutFlag } from "../api/client";

export interface UseFlagsState {
  flags: RolloutFlag[];
  loading: boolean;
  error: Error | null;
}

export function useFlags(): UseFlagsState & { updateFlag: (key: string, rolloutPercent: number) => Promise<void> } {
  const [flags, setFlags] = useState<RolloutFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api
      .getFlags()
      .then((r) => {
        setFlags(r.flags);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  const updateFlag = async (key: string, rolloutPercent: number) => {
    const updated = await api.updateFlag(key, rolloutPercent);
    setFlags((prev) => prev.map((f) => (f.key === key ? updated : f)));
  };

  return { flags, loading, error, updateFlag };
}
