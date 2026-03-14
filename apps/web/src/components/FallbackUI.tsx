import type React from "react";

export interface FallbackUIProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const FallbackUI: React.FC<FallbackUIProps> = ({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry
}) => {
  return (
    <div role="alert" className="fallback">
      <h2 className="fallback__title">{title}</h2>
      <p className="fallback__message">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--lg fallback__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};
