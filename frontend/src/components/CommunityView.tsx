import type { Community } from '../api';
import { DetailField } from './DetailField';
import { NoteListPanel } from './NoteListPanel';

export function CommunityView({ community }: { community: Community }) {
 
  return (
    <div className="detail-view">
      <DetailField label="Community Name" value={community.name} />
      <DetailField label="Description" value={community.description} />

      <NoteListPanel communityId={community.community_id} apiStatus="loading" />
      
      <div className="form-section">
        <h4>Location</h4>
        <DetailField label="Address" value={community.address} />
        <div className="form-row">
          <DetailField label="City" value={community.city} />
          <DetailField label="State" value={community.state} />
          <DetailField label="ZIP Code" value={community.zip_code} />
        </div>
      </div>

      <div className="form-section">
        <h4>Leadership</h4>
        <DetailField label="President Name" value={community.president_name} />
        <DetailField label="President Email" value={community.president_email} />
      </div>

      <div className="form-section">
        <h4>Financial</h4>
        <div className="form-row">
          <DetailField
            label="Monthly Dues"
            /* Requires formatting to represent currency when a value is available */
            value={community.monthly_dues !== null ? `$${community.monthly_dues.toFixed(2)}` : null}
          />
          <DetailField
            label="Annual Budget"
            /* Requires formatting to represent currency when a value is available */
            value={community.annual_budget !== null ? `$${community.annual_budget.toFixed(2)}` : null}
          />
          <DetailField label="Founded Year" value={community.founded_year} />
        </div>
      </div>
    </div>
  );
}