import React, { useState, ChangeEvent } from 'react';
import { TestScore } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import ScoreHistoryChart from '../charts/ScoreHistoryChart';
import { MAX_TEST_ENTRIES } from '../../constants.tsx';





// Placeholder Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>;
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>;

interface ScoreTrackerProps {
  scores: TestScore[];
  onScoresChange: (scores: TestScore[]) => void;
  userName: string;
}

const ScoreTracker: React.FC<ScoreTrackerProps> = ({ scores, onScoresChange, userName }) => {
  const [newScore, setNewScore] = useState<Partial<TestScore>>({ testName: '', score: undefined, maxScore: 100, date: new Date().toISOString().split('T')[0] });
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewScore(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };
  
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const { name, value, type } = e.target;
    onScoresChange(scores.map(s => s.id === id ? {...s, [name]: type === 'number' ? parseFloat(value) || 0 : value } : s));
  };

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (newScore.testName && newScore.score !== undefined && newScore.date) {
      if (scores.length >= MAX_TEST_ENTRIES) {
        alert(`Maximum ${MAX_TEST_ENTRIES} entries reached for this tracking period.`);
        return;
      }
      onScoresChange([...scores, { ...newScore, id: Date.now().toString() } as TestScore]);
      setNewScore({ testName: '', score: undefined, maxScore: 100, date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleDeleteScore = (id: string) => {
    onScoresChange(scores.filter(score => score.id !== id));
    if (editingScoreId === id) setEditingScoreId(null);
  };

  const sortedScores = [...scores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const highestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : null;
  const lowestScore = scores.length > 0 ? Math.min(...scores.map(s => s.score)) : null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddScore} className="p-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg shadow space-y-3 md:space-y-0 md:flex md:items-end md:gap-3">
        <Input name="testName" label="Test Name" value={newScore.testName || ''} onChange={handleInputChange} placeholder="e.g., Bi-Weekly 1" wrapperClassName="flex-grow mb-0" required />
        <Input name="score" label="Score" type="number" value={newScore.score || ''} onChange={handleInputChange} placeholder="Your Score" wrapperClassName="md:w-24 mb-0" min="0" max={newScore.maxScore || 100} required />
        <Input name="maxScore" label="Max Score" type="number" value={newScore.maxScore || ''} onChange={handleInputChange} placeholder="e.g. 100" wrapperClassName="md:w-24 mb-0" min="0" required />
        <Input name="date" label="Date" type="date" value={newScore.date || ''} onChange={handleInputChange} wrapperClassName="md:w-40 mb-0" required />
        <Button type="submit" variant="primary" className="w-full md:w-auto mt-3 md:mt-0" leftIcon={<PlusIcon className="w-5 h-5" />}>
          Add Score
        </Button>
      </form>

      {scores.length > 0 && <ScoreHistoryChart scores={scores} userName={userName} />}

      {scores.length === 0 && <p className="text-center text-text-muted-light dark:text-text-muted-dark py-4">No scores logged yet. Record your victories!</p>}
      
      <div className="overflow-x-auto bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-100/50 dark:bg-gray-900/50">
            <tr>
              {['Test Name', 'Score', 'Max Score', 'Date', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider font-zen-dots">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedScores.map(score => (
              <tr key={score.id} className={`transition-colors ${score.score === highestScore ? 'bg-green-500/20 dark:bg-green-400/20' : ''} ${score.score === lowestScore ? 'bg-red-500/20 dark:bg-red-400/20' : ''}`}>
                {editingScoreId === score.id ? (
                  <>
                    <td className="px-4 py-3 whitespace-nowrap"><Input name="testName" value={score.testName} onChange={e => handleEditInputChange(e, score.id)} className="text-sm" wrapperClassName="m-0" /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Input name="score" type="number" value={score.score} onChange={e => handleEditInputChange(e, score.id)} className="text-sm w-20" wrapperClassName="m-0" /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Input name="maxScore" type="number" value={score.maxScore} onChange={e => handleEditInputChange(e, score.id)} className="text-sm w-20" wrapperClassName="m-0" /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Input name="date" type="date" value={score.date} onChange={e => handleEditInputChange(e, score.id)} className="text-sm" wrapperClassName="m-0" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Button onClick={() => setEditingScoreId(null)} size="sm" variant="primary">Save</Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">{score.testName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{score.score}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{score.maxScore}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">{new Date(score.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-1.5">
                      <Button onClick={() => setEditingScoreId(score.id)} variant="ghost" size="sm" className="!p-1.5" aria-label="Edit score"><PencilIcon className="w-4 h-4" /></Button>
                      <Button onClick={() => handleDeleteScore(score.id)} variant="ghost" size="sm" className="!p-1.5 !text-red-500 hover:!bg-red-500/10" aria-label="Delete score"><TrashIcon className="w-4 h-4" /></Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreTracker;