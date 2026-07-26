import { useEffect, useState } from 'react';
import { notesAPI } from '../api';
import type {Note } from '../api';

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

interface NoteListPanelProps {
  communityId: number;
  apiStatus: 'loading' | 'success' | 'error' | 'idle';
}

export function NoteListPanel({ communityId, apiStatus }: NoteListPanelProps) {

const [notes, setNotes] = useState<Note[]>([]);
const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
const [draft, setDraft] = useState({description: '' });

  useEffect(() => {
    setEditingNoteId(null);
    // Load notes independently when a community is selected
    if (communityId) {
      notesAPI
        .list(communityId)
        .then((res) => setNotes(res.data))
        .catch((err) => {
          console.error('Failed to load notes', err);
          setNotes([]);
        });
    } else {
      setNotes([]);
    }
  }, [communityId]);

  const onCreateNew = async () => {
    try {
      const response = await notesAPI.create(communityId, { description: '' });
        setNotes((prevNotes) => [response.data, ...prevNotes]);
    } catch (error) {
      console.error('Failed to create note', error);
    }
  };

  const enterEditMode = (note: Note) => {
    setEditingNoteId(note.note_id);
    setDraft({description: note.description});
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
  };

  const saveNote = async () => {
    if (editingNoteId === null) return;
    try {
      const response = await notesAPI.update(communityId, editingNoteId, {
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
      await notesAPI.delete(communityId, noteId);
      setNotes(notes.filter((note) => note.note_id !== noteId));
      if (editingNoteId === noteId) {
        setEditingNoteId(null);
      }
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return (
    <div className="note-list-panel">
     <div className="form-section">
          <h4>Notes</h4>

           <div className="list-header-actions">
          <button className="btn btn-primary btn-small" onClick={onCreateNew}>
            New Note
          </button>
          {apiStatus === 'loading' && <span className="spinner"></span>}
        </div>
        
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
                  {/* <div className="note-header">
                    <strong>{note.description}</strong>
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
                  </div> */}
                  <div className="note-meta">{formatDate(note.creation_date)}</div>
                  {editingNoteId === note.note_id ? (
                    <div className="note-edit">
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
    </div>
  );
}