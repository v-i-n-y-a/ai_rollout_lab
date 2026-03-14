import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useSessionId } from "../hooks/useSessionId";
import { useSummary } from "../hooks/useSummary";
import { AISummaryCard } from "../components/AISummaryCard";
import { FeedbackForm } from "../components/FeedbackForm";
import { ViewTransitionLink } from "../components/ViewTransitionLink";

export const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const sessionId = useSessionId();
  const { summary, inRollout, loading: summaryLoading, error: summaryError } = useSummary(id, sessionId);
  const [item, setItem] = useState<{ id: string; title: string; description: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getItem(id).then(setItem).catch(() => setItem(null));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api.logEvent({ kind: "view", subjectId: id, sessionId }).catch(() => {});
  }, [id, sessionId]);

  useEffect(() => {
    if (!id || !inRollout || !summary) return;
    api.logEvent({ kind: "summary_view", subjectId: id, sessionId }).catch(() => {});
  }, [id, sessionId, inRollout, summary]);

  const handleFeedback = (data: { rating: number; comment?: string }) => {
    if (!id) return Promise.resolve();
    return api
      .submitFeedback({
        subjectType: "summary",
        subjectId: id,
        rating: data.rating,
        comment: data.comment
      })
      .then(() => {
        api.logEvent({
          kind: "feedback",
          subjectId: id,
          sessionId,
          payload: { rating: data.rating }
        }).catch(() => {});
      });
  };

  if (!id) return null;
  if (!item) return <div className="page loading">Loading…</div>;

  return (
    <div className="page page__sections">
      <ViewTransitionLink to="/" className="back-link">
        ← Back to items
      </ViewTransitionLink>
      <section className="section">
        <h1 className="section__title">{item.title}</h1>
        <p className="section__meta">{item.description}</p>
      </section>

      {summaryLoading && (
        <section className="section">
          <p className="section__meta" style={{ margin: 0 }}>Loading summary…</p>
        </section>
      )}
      {summaryError && (
        <section className="section">
          <p className="text-error" style={{ margin: 0 }}>Failed to load summary.</p>
        </section>
      )}
      {!summaryLoading && !summaryError && (
        <section className="section">
          {summary ? (
            <AISummaryCard summary={summary}>
              <FeedbackForm
                subjectType="summary"
                onSubmit={handleFeedback}
              />
            </AISummaryCard>
          ) : inRollout ? (
            <p className="section__meta" style={{ margin: 0 }}>No summary available for this item.</p>
          ) : (
            <p className="text-muted" style={{ margin: 0, fontSize: "var(--text-sm)" }}>
              AI summary is not available for your session (rollout).
            </p>
          )}
        </section>
      )}
    </div>
  );
}
