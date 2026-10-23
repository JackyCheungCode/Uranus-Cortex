import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Button label. Keep visible text for important actions. */
  children: ReactNode;
  /** Visual intent. Primary is the default action. */
  variant?: ButtonVariant;
  /** Compact, standard, or large control height. */
  size?: ButtonSize;
  /** Shows a spinner and prevents repeated activation. */
  loading?: boolean;
  /** Expand to fill the available inline width. */
  fullWidth?: boolean;
}

/**
 * Uranus Design System button.
 *
 * Native button semantics and keyboard behavior are preserved. Use an explicit
 * type="button" for non-submit actions inside forms.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const classes = [
    'uranus-button',
    `uranus-button--${variant}`,
    `uranus-button--${size}`,
    fullWidth ? 'uranus-button--full-width' : '',
    loading ? 'uranus-button--loading' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <span className="uranus-button__spinner" aria-hidden="true" />}
      <span className="uranus-button__label">{children}</span>
    </button>
  );
}

export default Button;
