import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

type FieldProps = {
  label: string;
  error?: FieldError | string;
  hint?: string;
};

function errorText(error?: FieldError | string) {
  return typeof error === 'string' ? error : error?.message;
}

export function TextField({ label, error, hint, id, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = id ?? String(props.name);
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      <input id={fieldId} aria-describedby={describedBy} aria-invalid={Boolean(error)} {...props} />
      {hint ? <span id={`${fieldId}-hint`} className="hint">{hint}</span> : null}
      {error ? <span id={`${fieldId}-error`} className="error-text">{errorText(error)}</span> : null}
    </div>
  );
}

export function PasswordField({ label, error, hint, id, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? String(props.name);
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      <div className="password-control">
        <input id={fieldId} type={visible ? 'text' : 'password'} aria-describedby={describedBy} aria-invalid={Boolean(error)} {...props} />
        <button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible((current) => !current)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
      </div>
      {hint ? <span id={`${fieldId}-hint`} className="hint">{hint}</span> : null}
      {error ? <span id={`${fieldId}-error`} className="error-text">{errorText(error)}</span> : null}
    </div>
  );
}

export function SelectField({ label, error, children, id, ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const fieldId = id ?? String(props.name);
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      <select id={fieldId} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} {...props}>
        {children}
      </select>
      {error ? <span id={`${fieldId}-error`} className="error-text">{errorText(error)}</span> : null}
    </div>
  );
}

export function TextAreaField({ label, error, id, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? String(props.name);
  return (
    <div className="field field-wide">
      <label htmlFor={fieldId}>{label}</label>
      <textarea id={fieldId} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} {...props} />
      {error ? <span id={`${fieldId}-error`} className="error-text">{errorText(error)}</span> : null}
    </div>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="form-section" aria-labelledby={title.replaceAll(' ', '-')}>
      <div className="section-heading">
        <h2 id={title.replaceAll(' ', '-')}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="form-grid">{children}</div>
    </section>
  );
}

export function CheckboxGroup({
  legend,
  options,
  value,
  onChange,
  error,
}: {
  legend: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}) {
  return (
    <fieldset className="field field-wide checkbox-group">
      <legend>{legend}</legend>
      {options.map((option) => {
        const checked = value.includes(option);
        return (
          <label key={option} className="check-option">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(checked ? value.filter((item) => item !== option) : [...value, option])}
            />
            <span>{option}</span>
          </label>
        );
      })}
      {error ? <span className="error-text">{error}</span> : null}
    </fieldset>
  );
}
