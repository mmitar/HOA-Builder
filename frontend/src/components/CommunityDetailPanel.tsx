import type { Community } from '../api';
import { CommunityView } from './CommunityView';
import { CommunityForm } from './CommunityForm';

interface CommunityDetailPanelProps {
  isOpen: boolean;
  community: Community | null;
  isEditing: boolean;
  editData: Partial<Community>;
  isSaving: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  onNameChange: (value: string) => void;
  onFieldChange: (field: keyof Community, value: any) => void;
  onSave: () => void;
  onClose: () => void;
  onRequestDelete: () => void;
}

export function CommunityDetailPanel({
  isOpen,
  community,
  isEditing,
  editData,
  isSaving,
  onEditStart,
  onEditCancel,
  onNameChange,
  onFieldChange,
  onSave,
  onClose,
  onRequestDelete,
}: CommunityDetailPanelProps) {
  /* 
  Nothing to render when the pane is closed — avoids doing work for
  content that's translated off-screen anyway.
  */
  if (!isOpen) return <div className="detail-panel" />;

  return (
    <div className="detail-panel open">
      <div className="detail-header">
        <div className="detail-actions">
          {!isEditing ? (
            <>
              <button className="btn btn-primary" onClick={onEditStart}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={onRequestDelete}>
                Delete
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-success" onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={onEditCancel} disabled={isSaving}>
                Cancel
              </button>
            </>
          )}
          <button className="close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
      </div>

      <div className="detail-content">
        {!isEditing && community ? (
          <CommunityView community={community} />
        ) : (
          <CommunityForm data={editData} onChange={onFieldChange} />
        )}
      </div>
    </div>
  );
}