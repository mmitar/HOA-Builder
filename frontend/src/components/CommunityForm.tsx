import type { Community } from '../api';
import { FormField } from './FormField';

interface CommunityFormProps {
  data: Partial<Community>;
  // Callback to notify parent of changes to any field in the form
  onChange: (field: keyof Community, value: any) => void;
}

export function CommunityForm({ data, onChange }: CommunityFormProps) {
  const notes = (data.community_notes ?? '').toString();

  return (
    <form className="detail-edit">
      <FormField
        label="Community Name"
        value={data.name || ''}
        onChange={(v) => onChange('name', v)}
        required
      />
      <FormField
        label="Community Notes"
        type="textarea"
        value={notes}
        onChange={(v) => onChange('community_notes', v)}
        hint={`${notes.length}/500`}
      />

      <div className="form-section">
        <h4>Location</h4>
        <FormField label="Address" value={data.address || ''} onChange={(v) => onChange('address', v)} />
        <div className="form-row">
          <FormField label="City" value={data.city || ''} onChange={(v) => onChange('city', v)} />
          <FormField label="State" value={data.state || ''} onChange={(v) => onChange('state', v)} />
          <FormField label="ZIP Code" value={data.zip_code || ''} onChange={(v) => onChange('zip_code', v)} />
        </div>
      </div>

      <div className="form-section">
        <h4>Leadership</h4>
        <FormField
          label="President Name"
          value={data.president_name || ''}
          onChange={(v) => onChange('president_name', v)}
        />
        <FormField
          label="President Email"
          type="email"
          value={data.president_email || ''}
          onChange={(v) => onChange('president_email', v)}
        />
      </div>

      <div className="form-section">
        <h4>Financial</h4>
        <div className="form-row">
          <FormField
            label="Monthly Dues"
            type="number"
            step="0.01"
            value={data.monthly_dues ?? ''}
            onChange={(v) => onChange('monthly_dues', v ? parseFloat(v) : null)}
          />
          <FormField
            label="Annual Budget"
            type="number"
            step="0.01"
            value={data.annual_budget ?? ''}
            onChange={(v) => onChange('annual_budget', v ? parseFloat(v) : null)}
          />
          <FormField
            label="Founded Year"
            type="number"
            value={data.founded_year ?? ''}
            onChange={(v) => onChange('founded_year', v ? parseInt(v, 10) : null)}
          />
        </div>
      </div>
    </form>
  );
}