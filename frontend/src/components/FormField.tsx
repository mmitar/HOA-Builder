interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea';
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  step?: string;
  hint?: string;
}

export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required,
  step,
  hint,
}: FormFieldProps) {
  return (
    <div className="form-group">
      <label>
        {label}
        {required ? ' *' : ''}
      </label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          type={type}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
      {hint && <div className="char-counter">{hint}</div>}
    </div>
  );
}