import { useEffect, useState } from 'react';
import { notesAPI } from '../api';
import type { Note } from '../api';
import type { FlashMessage } from './Toast';

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

const NOTE_MAX_LENGTH = 500;
// Sentinel id for the unsaved draft note that only exists client-side until saved.
const NEW_NOTE_ID = -1;

interface NoteListPanelProps {
  communityId: number;
  onFlashMessage: FlashMessage;
}

export function NoteListPanel({ communityId, onFlashMessage }: NoteListPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [draft, setDraft] = useState({ message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditingNoteId(null);
    // Load notes independently when a community is selected
    if (communityId) {
      setIsLoading(true);
      notesAPI
        .list(communityId)
        .then((res) => setNotes(res.data))
        .catch((err) => {
          console.error('Failed to load notes', err);
          setNotes([]);
          onFlashMessage('error', 'Failed to load notes');
        })
        .finally(() => setIsLoading(false));
    } else {
      setNotes([]);
    }
  }, [communityId]);

  const enterEditMode = (note: Note) => {
    setEditingNoteId(note.note_id);
    setDraft({ message: note.message });
  };

  const onCreateNew = () => {
    // Avoid stacking multiple unsaved drafts.
    if (editingNoteId === NEW_NOTE_ID) return;
    const draftNote: Note = {
      note_id: NEW_NOTE_ID,
      message: '',
      creation_date: new Date().toISOString(),
    };
    setNotes((prevNotes) => [draftNote, ...prevNotes]);
    setEditingNoteId(NEW_NOTE_ID);
    setDraft({ message: '' });
  };

  const cancelEdit = () => {
    // Discard the unsaved draft; leave persisted notes untouched.
    if (editingNoteId === NEW_NOTE_ID) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.note_id !== NEW_NOTE_ID));
    }
    setEditingNoteId(null);
  };

  const saveNote = async () => {
    if (editingNoteId === null) return;

    const message = draft.message.trim();
    if (!message) {
      onFlashMessage('error', 'Note cannot be blank');
      return;
    }
    if (message.length > NOTE_MAX_LENGTH) {
      onFlashMessage('error', `Note cannot exceed ${NOTE_MAX_LENGTH} characters`);
      return;
    }

    try {
      if (editingNoteId === NEW_NOTE_ID) {
        const response = await notesAPI.create(communityId, { message });
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.note_id === NEW_NOTE_ID ? response.data : note)),
        );
        onFlashMessage('success', 'Note created successfully', true);
      } else {
        const response = await notesAPI.update(communityId, editingNoteId, { message });
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.note_id === editingNoteId ? response.data : note)),
        );
        onFlashMessage('success', 'Note saved successfully', true);
      }
      setEditingNoteId(null);
    } catch (error: any) {
      console.error('Failed to save note', error);
      onFlashMessage('error', error.response?.data?.detail || 'Failed to save note');
    }
  };

  const removeNote = async (noteId: number) => {
    try {
      await notesAPI.delete(communityId, noteId);
      setNotes(notes.filter((note) => note.note_id !== noteId));
      if (editingNoteId === noteId) {
        setEditingNoteId(null);
      }
      onFlashMessage('success', 'Note deleted successfully', true);
    } catch (error: any) {
      console.error('Failed to delete note', error);
      onFlashMessage('error', error.response?.data?.detail || 'Failed to delete note');
    }
  };

  return (
    <div className="form-section note-list-panel">
      <div className="note-list-header">
        <h4>Notes</h4>
        <div className="list-header-actions">
          <button className="btn btn-primary btn-small" onClick={onCreateNew}>
            New Note
          </button>
          {isLoading && <span className="spinner"></span>}
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="empty-state">No notes available.</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => {
            const isEditing = editingNoteId === note.note_id;
            return (
              <li
                key={note.note_id}
                className={`note-item ${isEditing ? 'editing' : ''}`}
                onClick={isEditing ? undefined : () => enterEditMode(note)}
              >
                <div className="note-body">
                  {isEditing ? (
                    <>
                      <textarea
                        className="note-input"
                        value={draft.message}
                        autoFocus
                        maxLength={NOTE_MAX_LENGTH}
                        onChange={(event) => setDraft({ ...draft, message: event.target.value })}
                      />
                      <div className="char-counter">
                        {draft.message.length}/{NOTE_MAX_LENGTH}
                      </div>
                    </>
                  ) : (
                    <p className="note-text">
                      {note.message || <span className="note-placeholder">Empty note — click to edit</span>}
                    </p>
                  )}
                  <div className="note-meta">{formatDate(note.creation_date)}</div>
                </div>

                <div className="note-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="note-icon-btn note-icon-save"
                        title="Save changes"
                        aria-label="Save changes"
                        disabled={!draft.message.trim()}
                        onClick={(event) => {
                          event.stopPropagation();
                          saveNote();
                        }}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="note-icon-btn note-icon-cancel"
                        title="Cancel changes"
                        aria-label="Cancel changes"
                        onClick={(event) => {
                          event.stopPropagation();
                          cancelEdit();
                        }}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="note-icon-btn note-icon-delete"
                      title="Delete note"
                      aria-label="Delete note"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeNote(note.note_id);
                      }}
                    >
                      🗑
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}