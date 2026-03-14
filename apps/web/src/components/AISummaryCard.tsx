import type React from "react";

export interface AISummaryCardProps {
  summary: string;
  badge?: string;
  children?: React.ReactNode;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  badge = "AI summary",
  children
}) => {
  return (
    <section className="summary-card" data-cy="ai-summary-card">
      <span className="summary-card__badge" data-cy="ai-summary-badge">
        {badge}
      </span>
      <p className="summary-card__text" data-cy="ai-summary-text">
        {summary}
      </p>
      {children && <div className="summary-card__actions">{children}</div>}
    </section>
  );
};
