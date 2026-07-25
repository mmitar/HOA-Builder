interface DetailFieldProps {
  label: string;
  value?: string | number | null;
}

// Always renders the field (with a placeholder when empty) so fields position is consistent
export function DetailField({ label, value }: DetailFieldProps) {
  const isEmpty = value === null || value === undefined || value === '';
  return (
    <div className="detail-field">
      <label>{label}</label>
      <p>{isEmpty ? '—' : value}</p>
    </div>
  );
}