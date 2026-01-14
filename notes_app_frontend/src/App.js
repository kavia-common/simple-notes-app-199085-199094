import React, { useEffect, useMemo, useState } from 'react';
import NoteItem from './components/NoteItem';
import './App.css';

const STORAGE_KEY = 'notes';

/**
 * Creates a reasonably-unique id for notes.
 * Avoids adding external dependencies and is stable enough for local-only storage.
 */
function createId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * Safely loads notes from localStorage. Returns [] when not available or invalid.
 */
function loadNotesFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive validation: only keep notes with {id, text}
    return parsed
      .filter((n) => n && typeof n.id === 'string' && typeof n.text === 'string')
      .map((n) => ({ id: n.id, text: n.text }));
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
function App() {
  /** Notes list, persisted to localStorage (key: 'notes'). */
  const [notes, setNotes] = useState(() => loadNotesFromStorage());

  /** Controlled input for creating a new note. */
  const [newText, setNewText] = useState('');

  const noteCountLabel = useMemo(() => {
    const count = notes.length;
    return `${count} note${count === 1 ? '' : 's'}`;
  }, [notes.length]);

  // Persist notes on changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // If storage fails (quota / blocked), app still works in-memory.
    }
  }, [notes]);

  const canAdd = newText.trim().length > 0;

  // PUBLIC_INTERFACE
  const handleAdd = (e) => {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;

    const next = [{ id: createId(), text }, ...notes];
    setNotes(next);
    setNewText('');
  };

  // PUBLIC_INTERFACE
  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // PUBLIC_INTERFACE
  const handleSave = (id, text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text: trimmed } : n)));
    return true;
  };

  return (
    <div className="App">
      <main className="appShell">
        <header className="appHeader">
          <div className="titleBlock">
            <h1 className="appTitle">Notes</h1>
            <p className="appSubtitle" aria-label="notes-count">
              {noteCountLabel}
            </p>
          </div>
        </header>

        <section className="surface addCard" aria-label="add-note">
          <form className="addForm" onSubmit={handleAdd}>
            <label className="label" htmlFor="new-note">
              Add a note
            </label>
            <textarea
              id="new-note"
              className="textarea"
              rows={4}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Write something…"
            />
            <div className="actionsRow">
              <button className="btn btnPrimary" type="submit" disabled={!canAdd}>
                Add
              </button>
            </div>
          </form>
        </section>

        <section className="notesSection" aria-label="notes-list">
          {notes.length === 0 ? (
            <div className="surface emptyState" role="status">
              <h2 className="emptyTitle">No notes yet</h2>
              <p className="emptyText">Add your first note using the form above.</p>
            </div>
          ) : (
            <ul className="notesList">
              {notes.map((note) => (
                <li key={note.id} className="noteListItem">
                  <NoteItem note={note} onDelete={handleDelete} onSave={handleSave} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
