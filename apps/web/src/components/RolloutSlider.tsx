import type React from "react";

export interface RolloutSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onUpdate?: () => void;
  updating?: boolean;
  updateButtonLabel?: string;
}

export const RolloutSlider: React.FC<RolloutSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  onChange,
  onUpdate,
  updating = false,
  updateButtonLabel = "Update"
}) => {
  return (
    <div className="rollout-row" data-cy="rollout-slider">
      <code className="rollout-row__label" data-cy="rollout-label">
        {label}
      </code>
      <input
        type="range"
        className="rollout-row__input"
        min={min}
        max={max}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        data-cy="rollout-slider-input"
      />
      <span className="rollout-row__value" data-cy="rollout-value">
        {value}%
      </span>
      {onUpdate && (
        <button
          type="button"
          className="btn"
          onClick={onUpdate}
          disabled={updating}
          data-cy="rollout-update-btn"
        >
          {updating ? "Updating…" : updateButtonLabel}
        </button>
      )}
    </div>
  );
};
