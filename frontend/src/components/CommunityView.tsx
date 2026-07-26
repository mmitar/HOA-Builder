import { useEffect, useState } from 'react';
import type { Community, Note } from '../api';
import { notesAPI } from '../api';
import { DetailField } from './DetailField';

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function CommunityView({ community }: { community: Community }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [draft, setDraft] = useState({ title: '', description: '' });

  useEffect(() => {
    setEditingNoteId(null);
    // Load notes independently when a community is selected
    if (community && community.community_id) {
      notesAPI
        .list(community.community_id)
        .then((res) => setNotes(res.data))
        .catch((err) => {
          console.error('Failed to load notes', err);
          setNotes([]);
        });
    } else {
      setNotes([]);
    }
  }, [community]);

  const enterEditMode = (note: Note) => {
    setEditingNoteId(note.note_id);
    setDraft({ title: note.title, description: note.description });
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
  };

  const saveNote = async () => {
    if (editingNoteId === null) return;
    try {
      const response = await notesAPI.update(community.community_id, editingNoteId, {
        title: draft.title,
        description: draft.description,
      });
      setNotes(notes.map((note) => (note.note_id === editingNoteId ? response.data : note)));
      setEditingNoteId(null);
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

  const removeNote = async (noteId: number) => {
    try {
      await notesAPI.delete(community.community_id, noteId);
      setNotes(notes.filter((note) => note.note_id !== noteId));
      if (editingNoteId === noteId) {
        setEditingNoteId(null);
      }
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return (
    <div className="detail-view">
      <DetailField label="Community Name" value={community.name} />
      <DetailField label="Description" value={community.description} />

      <div className="form-section">
        <h4>Notes</h4>
        {notes.length === 0 ? (
          <p className="empty-state">No notes available.</p>
        ) : (
          <ol className="notes-list">
            {notes.map((note) => (
              <li
                key={note.note_id}
                className={`note-item ${editingNoteId === note.note_id ? 'editing' : ''}`}
                onClick={() => enterEditMode(note)}
              >
                <div className="note-header">
                  <strong>{note.title}</strong>
                  <button
                    type="button"
                    className="note-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeNote(note.note_id);
                    }}
                    title="Delete note"
                  >
                    ✕
                  </button>
                </div>
                <div className="note-meta">{formatDate(note.creation_date)}</div>
                {editingNoteId === note.note_id ? (
                  <div className="note-edit">
                    <label>
                      Title
                      <input
                        value={draft.title}
                        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        value={draft.description}
                        onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                      />
                    </label>
                    <div className="note-actions">
                      <button className="btn btn-success btn-small" type="button" onClick={saveNote}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-small" type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{note.description}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

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