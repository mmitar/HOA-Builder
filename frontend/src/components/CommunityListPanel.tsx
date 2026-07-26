import type { Community } from '../api';

interface CommunityListPanelProps {
  communities: Community[];
  selectedId?: number;
  isLoading: boolean;
  onSelect: (community: Community) => void;
  onCreateNew: () => void;
}

export function CommunityListPanel({
  communities,
  selectedId,
  isLoading,
  onSelect,
  onCreateNew,
}: CommunityListPanelProps) {
  return (
    <div className="list-panel">
      <div className="list-header">
        <h1>Communities</h1>
        <div className="list-header-actions">
          <button className="btn btn-primary btn-small" onClick={onCreateNew}>
            New Community
          </button>
          {isLoading && <span className="spinner"></span>}
        </div>
      </div>

      <div className="communities-list">
        {communities.length === 0 ? (
          <p className="empty-state">No communities found</p>
        ) : (
          communities.map((community) => (
            <div
              key={community.community_id}
              className={`community-item ${selectedId === community.community_id ? 'selected' : ''}`}
              onClick={() => onSelect(community)}
            >
              <div className="community-name">{community.name}</div>
              {community.city && (
                <div className="community-location">
                  {community.city}, {community.state}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}