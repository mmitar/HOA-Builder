import { useState, useEffect } from 'react';
import { communitiesAPI } from './api';
import type { Community } from './api';
import { Toast } from './components/Toast';
import { ProjectInfoPanel } from './components/ProjectInfoPanel';
import { CommunityListPanel } from './components/CommunityListPanel';
import { CommunityDetailPanel } from './components/CommunityDetailPanel';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import './App.css';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

const EMPTY_COMMUNITY: Omit<Community, 'community_id'> = {
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  president_name: '',
  president_email: '',
  annual_budget: null,
  monthly_dues: null,
  founded_year: null,
};

function App() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Community>>({});
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');
  const [apiMessage, setApiMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProjectInfo, setShowProjectInfo] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  // Central place to set status + message, with optional auto-dismiss —
  // replaces the repeated setApiStatus/setApiMessage/setTimeout trio.
  const flashMessage = (status: ApiStatus, message: string, autoDismiss = false) => {
    setApiStatus(status);
    setApiMessage(message);
    if (autoDismiss) {
      setTimeout(() => setApiMessage(''), 3000);
    }
  };

  const loadCommunities = async () => {
    try {
      flashMessage('loading', '');
      const response = await communitiesAPI.list();
      setCommunities(response.data);
      flashMessage('success', 'Communities loaded successfully', true);
    } catch (error: any) {
      flashMessage('error', error.response?.data?.detail || 'Failed to load communities');
    }
  };

  const handleSelectCommunity = (community: Community) => {
    setSelectedCommunity(community);
    setIsEditing(false);
    setEditData({});
  };

  const handleCreateNew = () => {
    setSelectedCommunity(null);
    setEditData(EMPTY_COMMUNITY);
    setIsEditing(true);
  };

  const handleEditStart = () => {
    setEditData(selectedCommunity || {});
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleEditChange = (field: keyof Community, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setSelectedCommunity(null);
    setIsEditing(false);
    setEditData({});
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = async () => {
    const name = (editData.name ?? '').toString();

    if (!name.trim()) {
      flashMessage('error', 'Community name cannot be blank');
      return;
    }

    try {
      flashMessage('loading', '');
      if (selectedCommunity) {
        const response = await communitiesAPI.update(selectedCommunity.community_id, editData as Community);
        setCommunities(communities.map((c) => (c.community_id === selectedCommunity.community_id ? response.data : c)));
        setSelectedCommunity(response.data);
        flashMessage('success', 'Community updated successfully', true);
      } else {
        const response = await communitiesAPI.create(editData as Community);
        setCommunities([response.data, ...communities]);
        setSelectedCommunity(response.data);
        flashMessage('success', 'Community created successfully', true);
      }
      setIsEditing(false);
    } catch (error: any) {
      const fallback = selectedCommunity ? 'Failed to update community' : 'Failed to create community';
      flashMessage('error', error.response?.data?.detail || fallback);
    }
  };

  const handleDelete = async () => {
    if (!selectedCommunity) return;

    try {
      flashMessage('loading', '');
      await communitiesAPI.delete(selectedCommunity.community_id);
      setCommunities(communities.filter((c) => c.community_id !== selectedCommunity.community_id));
      handleClose();
      flashMessage('success', 'Community deleted successfully', true);
    } catch (error: any) {
      flashMessage('error', error.response?.data?.detail || 'Failed to delete community');
    }
  };

  const hasChanges = () => {
    if (!selectedCommunity) {
      // Creating new community - check if anything is filled in
      return Object.values(editData).some(val => val !== null && val !== '' && val !== undefined);
    }
    // Editing existing - compare editData with selectedCommunity
    return Object.keys(editData).some(
      key => editData[key as keyof Community] !== selectedCommunity[key as keyof Community]
    );
  };

  const isDetailOpen = selectedCommunity !== null || isEditing;

  return (
    <div className="app">
      <Toast status={apiStatus} message={apiMessage} />

      <div className="container">
        <ProjectInfoPanel 
          isExpanded={showProjectInfo}
          onToggleExpand={() => setShowProjectInfo(!showProjectInfo)}
        />

        <CommunityListPanel
          communities={communities}
          selectedId={selectedCommunity?.community_id}
          isLoading={apiStatus === 'loading'}
          onSelect={handleSelectCommunity}
          onCreateNew={handleCreateNew}
        />

        <CommunityDetailPanel
          isOpen={isDetailOpen}
          community={selectedCommunity}
          isEditing={isEditing}
          editData={editData}
          isSaving={apiStatus === 'loading'}
          hasNoChanges={!hasChanges()}
          onEditStart={handleEditStart}
          onEditCancel={handleEditCancel}
          onFieldChange={handleEditChange}
          onSave={handleSaveEdit}
          onClose={handleClose}
          onRequestDelete={() => setShowDeleteConfirm(true)}
        />

        {showDeleteConfirm && (
          <DeleteConfirmModal
            communityName={selectedCommunity?.name}
            isDeleting={apiStatus === 'loading'}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;