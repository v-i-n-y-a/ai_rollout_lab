import type React from "react";

export interface BadgeProps {
  readonly children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.6rem",
        borderRadius: "999px",
        background: "rgba(37, 99, 235, 0.12)",
        color: "#dbeafe",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase"
      }}
    >
      {children}
    </span>
  );
};
