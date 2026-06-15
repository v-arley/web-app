import * as React from "react"

/**
 * Button component compatible with existing codebase.
 * Uses the centralized `.btn` system from style-button.css.
 * Maps `variant` prop to CSS classes.
 */

const variantMap: Record<string, string> = {
  default: "btn btn--primary",
  primary: "btn btn--primary",
  secondary: "btn btn--secondary",
  outline: "btn btn--outline",
  ghost: "btn btn--ghost",
  destructive: "btn btn--danger",
  danger: "btn btn--danger",
  link: "btn btn--link",
};

const sizeMap: Record<string, string> = {
  default: "",
  xs: "btn--sm",
  sm: "btn--sm",
  lg: "btn--lg",
  icon: "btn--icon",
};

function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: string;
  size?: string;
  asChild?: boolean;
}) {
  const variantClass = variantMap[variant] ?? "btn btn--secondary";
  const sizeClass = sizeMap[size] ?? "";

  return (
    <button
      className={`${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    />
  );
}

export { Button }
