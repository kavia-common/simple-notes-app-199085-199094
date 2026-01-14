import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

function typeIntoTextarea(labelText, value) {
  const textarea = screen.getByLabelText(labelText);
  fireEvent.change(textarea, { target: { value } });
  return textarea;
}

describe('Notes App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('renders app title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /notes/i })).toBeInTheDocument();
  });

  test('adds a note', () => {
    render(<App />);

    typeIntoTextarea(/add a note/i, 'My first note');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText('My first note')).toBeInTheDocument();
  });

  test('edits a note', () => {
    // Seed storage so we test initialization too.
    window.localStorage.setItem('notes', JSON.stringify([{ id: 'n1', text: 'Original' }]));
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    const editBox = screen.getByLabelText(/edit note/i);
    fireEvent.change(editBox, { target: { value: 'Updated note' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText('Updated note')).toBeInTheDocument();
    expect(screen.queryByText('Original')).not.toBeInTheDocument();
  });

  test('deletes a note', () => {
    window.localStorage.setItem('notes', JSON.stringify([{ id: 'n1', text: 'To delete' }]));
    render(<App />);

    expect(screen.getByText('To delete')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(screen.queryByText('To delete')).not.toBeInTheDocument();
  });
});
