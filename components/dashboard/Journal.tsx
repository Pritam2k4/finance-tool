
import React, { useState, ChangeEvent } from 'react';
import { JournalEntry } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input'; // Re-using Input for textarea via 'as' prop if needed, or use a dedicated TextArea component. For simplicity, using textarea directly.

// Placeholder Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>;
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>;


interface JournalProps {
  entries: JournalEntry[];
  onEntriesChange: (entries: JournalEntry[]) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onEntriesChange }) => {
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryText.trim()) return;
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: newEntryDate,
      entry: newEntryText.trim(),
      createdAt: Date.now(),
    };
    onEntriesChange([newEntry, ...entries]);
    setNewEntryText('');
    // setNewEntryDate(new Date().toISOString().split('T')[0]); // Optionally reset date or keep it
  };

  const handleDeleteEntry = (id: string) => {
    onEntriesChange(entries.filter(entry => entry.id !== id));
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = () => {
    if (editingEntry) {
      onEntriesChange(entries.map(e => e.id === editingEntry.id ? editingEntry : e));
      setEditingEntry(null);
    }
  };

  const handleEditingEntryChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingEntry) {
      setEditingEntry({ ...editingEntry, [e.target.name]: e.target.value });
    }
  };

  const sortedEntries = [...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddEntry} className="p-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg shadow space-y-3">
        <Input
            type="date"
            value={newEntryDate}
            onChange={(e) => setNewEntryDate(e.target.value)}
            label="Entry Date"
            wrapperClassName="mb-0"
            required
        />
        <textarea
          value={newEntryText}
          onChange={(e) => setNewEntryText(e.target.value)}
          placeholder="Chronicle your thoughts and adventures..."
          rows={5}
          className="w-full p-3 rounded-md bg-background-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-primary-light outline-none placeholder-gray-400 dark:placeholder-gray-500"
          required
        />
        <Button type="submit" variant="primary" size="md" className="w-full" leftIcon={<PlusIcon className="w-5 h-5"/>}>
          Add Journal Entry
        </Button>
      </form>

      {sortedEntries.length === 0 && <p className="text-center text-text-muted-light dark:text-text-muted-dark py-4">Your saga is yet unwritten. Start your journal!</p>}

      <ul className="space-y-4">
        {sortedEntries.map(entry => (
          <li key={entry.id} className="p-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg text-primary dark:text-primary-light">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
              <div className="flex space-x-1.5">
                <Button onClick={() => handleEditEntry(entry)} variant="ghost" size="sm" className="!p-1.5" aria-label="Edit entry"><PencilIcon className="w-4 h-4" /></Button>
                <Button onClick={() => handleDeleteEntry(entry.id)} variant="ghost" size="sm" className="!p-1.5 !text-red-500 hover:!bg-red-500/10" aria-label="Delete entry"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            </div>
            <p className="text-text-light dark:text-text-dark whitespace-pre-wrap">{entry.entry}</p>
          </li>
        ))}
      </ul>
      {editingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingEntry(null)}>
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-xl w-full max-w-lg text-left animate-slideInUp" onClick={e => e.stopPropagation()}>
            <h4 className="text-xl font-zen-dots text-primary dark:text-primary-light mb-4">Edit Journal Entry</h4>
            <Input
              label="Entry Date"
              type="date"
              name="date"
              value={editingEntry.date}
              onChange={handleEditingEntryChange}
              className="mb-3"
            />
            <textarea
              name="entry"
              value={editingEntry.entry}
              onChange={handleEditingEntryChange}
              rows={8}
              className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary-light outline-none"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={() => setEditingEntry(null)} variant="ghost">Cancel</Button>
              <Button onClick={handleSaveEdit} variant="primary">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
