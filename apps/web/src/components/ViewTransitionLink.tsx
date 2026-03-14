import type React from "react";
import { Link, useNavigate, type To } from "react-router-dom";

declare global {
  interface Document {
    startViewTransition?(cb: () => void | Promise<void>): Promise<{ finished: Promise<void> }>;
  }
}

export interface ViewTransitionLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: To;
  children: React.ReactNode;
  className?: string;
}

/** Link that uses View Transitions API when available (progressive enhancement). */
export const ViewTransitionLink: React.FC<ViewTransitionLinkProps> = ({
  to,
  children,
  className,
  onClick,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof document.startViewTransition === "function") {
      e.preventDefault();
      document.startViewTransition(() => {
        navigate(to);
      });
    }
    onClick?.(e);
  };

  return (
    <Link to={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};
