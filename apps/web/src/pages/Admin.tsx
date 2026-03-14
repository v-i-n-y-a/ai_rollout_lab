import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Metrics } from "../api/client";
import { useFlags } from "../hooks/useFlags";
import { RolloutSlider } from "../components/RolloutSlider";
import { ViewTransitionLink } from "../components/ViewTransitionLink";

export const Admin: React.FC = () => {
  const { flags, loading, error, updateFlag } = useFlags();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [draftPercent, setDraftPercent] = useState<Record<string, number>>({});

  useEffect(() => {
    api.getMetrics().then(setMetrics);
  }, []);

  useEffect(() => {
    setDraftPercent((prev) => {
      const next = { ...prev };
      flags.forEach((f) => {
        if (next[f.key] === undefined) next[f.key] = f.rolloutPercent;
      });
      return next;
    });
  }, [flags]);

  const handleUpdate = (key: string) => {
    const percent = draftPercent[key];
    if (percent === undefined) return;
    setUpdating(key);
    updateFlag(key, percent).finally(() => setUpdating(null));
  };

  return (
    <div className="page page__sections">
      <ViewTransitionLink to="/" className="back-link">
        ← Back to items
      </ViewTransitionLink>
      <h1 className="page-title">Admin</h1>

      <section style={{ marginBottom: "var(--space-8)" }}>
        <h2 className="page-subtitle" style={{ marginBottom: "var(--space-3)" }}>
          Feature flags (rollout %)
        </h2>
        {loading && <p className="loading">Loading flags…</p>}
        {error && <p className="text-error">{error.message}</p>}
        <ul className="flags-list">
          {flags.map((f) => (
            <li key={f.key}>
              <RolloutSlider
                label={f.key}
                value={draftPercent[f.key] ?? f.rolloutPercent}
                onChange={(v) => setDraftPercent((prev) => ({ ...prev, [f.key]: v }))}
                onUpdate={() => handleUpdate(f.key)}
                updating={updating === f.key}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="page-subtitle" style={{ marginBottom: "var(--space-3)" }}>
          Metrics
        </h2>
        {metrics && (
          <ul className="metrics-list">
            {Object.entries(metrics.byKind).map(([kind, count]) => (
              <li key={kind}>
                <code>{kind}</code>: {count}
              </li>
            ))}
            <li className="metrics-list__total">Total: {metrics.total}</li>
          </ul>
        )}
      </section>
    </div>
  );
}
