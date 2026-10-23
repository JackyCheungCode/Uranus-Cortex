import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import './input.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label. Provide a label or an explicit aria-label/aria-labelledby. */
  label?: string;
  /** Short instruction shown below the control. */
  helperText?: string;
  /** Validation message; also marks the field invalid. */
  error?: string;
  /** Control height. */
  size?: InputSize;
  /** Stretch the field to the container width. */
  fullWidth?: boolean;
  /** Optional content displayed inside the field before the text. */
  leadingAdornment?: ReactNode;
  /** Optional content displayed inside the field after the text. */
  trailingAdornment?: ReactNode;
}

/**
 * Uranus Design System text input.
 *
 * Uses a native input and an explicitly associated visible label when supplied.
 * Do not use placeholder text as a replacement for a label.
 */
export function Input({
  id,
  label,
  helperText,
  error,
  size = 'md',
  fullWidth = true,
  leadingAdornment,
  trailingAdornment,
  required = false,
  disabled = false,
  className,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? `uranus-input-${generatedId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId].filter(Boolean).join(' ') || undefined;
  const classes = [
    'uranus-input',
    `uranus-input--${size}`,
    fullWidth ? 'uranus-input--full-width' : '',
    error ? 'uranus-input--invalid' : '',
    disabled ? 'uranus-input--disabled' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label className="uranus-input__label" htmlFor={inputId}>
          <span>{label}</span>
          {required && <span className="uranus-input__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="uranus-input__control">
        {leadingAdornment && (
          <span className="uranus-input__adornment uranus-input__adornment--leading" aria-hidden="true">
            {leadingAdornment}
          </span>
        )}
        <input
          {...inputProps}
          id={inputId}
          className="uranus-input__native"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {trailingAdornment && (
          <span className="uranus-input__adornment uranus-input__adornment--trailing" aria-hidden="true">
            {trailingAdornment}
          </span>
        )}
      </div>
      {helperText && !error && (
        <p className="uranus-input__message" id={helperId}>{helperText}</p>
      )}
      {error && (
        <p className="uranus-input__message uranus-input__message--error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
