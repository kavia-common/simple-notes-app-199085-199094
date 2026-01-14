import React, { useEffect, useId, useState } from 'react';

// PUBLIC_INTERFACE
function NoteItem({ note, onDelete, onSave }) {
  /** Inline edit mode toggle. */
  const [isEditing, setIsEditing] = useState(false);

  /** Controlled input for edit textarea. */
  const [draft, setDraft] = useState(note.text);

  const textareaId = useId();

  // Keep draft in sync if the note changes externally.
  useEffect(() => {
    if (!isEditing) {
      setDraft(note.text);
    }
  }, [note.text, isEditing]);

  const canSave = draft.trim().length > 0;

  const startEdit = () => {
    setDraft(note.text);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(note.text);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const ok = onSave(note.id, draft);
    if (ok) setIsEditing(false);
  };

  return (
    <article className="surface noteCard" aria-label="note">
      {!isEditing ? (
        <>
          <p className="noteText">{note.text}</p>
          <div className="noteActions">
            <button className="btn btnSecondary" type="button" onClick={startEdit}>
              Edit
            </button>
            <button className="btn btnDanger" type="button" onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <label className="srOnly" htmlFor={textareaId}>
            Edit note
          </label>
          <textarea
            id={textareaId}
            className="textarea"
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="noteActions">
            <button className="btn btnSuccess" type="button" onClick={saveEdit} disabled={!canSave}>
              Save
            </button>
            <button className="btn btnSecondary" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default NoteItem;
