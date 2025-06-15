
import React, { useState, ChangeEvent } from 'react';
import { Goal } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

// Placeholder Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>;
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>;


interface GoalsManagerProps {
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
}

const GoalsManager: React.FC<GoalsManagerProps> = ({ goals, onGoalsChange }) => {
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      progress: 0,
      deadline: newGoalDeadline || undefined,
      createdAt: Date.now(),
    };
    onGoalsChange([newGoal, ...goals]);
    setNewGoalText('');
    setNewGoalDeadline('');
  };

  const handleDeleteGoal = (id: string) => {
    onGoalsChange(goals.filter(goal => goal.id !== id));
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleSaveEdit = () => {
    if (editingGoal) {
      onGoalsChange(goals.map(g => g.id === editingGoal.id ? editingGoal : g));
      setEditingGoal(null);
    }
  };

  const handleEditingGoalChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingGoal) {
      const { name, value, type } = e.target;
      setEditingGoal({ 
        ...editingGoal, 
        [name]: type === 'number' ? parseInt(value, 10) : value 
      });
    }
  };
  
  const handleProgressChange = (id: string, progress: number) => {
    const newProgress = Math.max(0, Math.min(100, progress));
    onGoalsChange(goals.map(goal => goal.id === id ? { ...goal, progress: newProgress } : goal));
  };

  const sortedGoals = [...goals].sort((a,b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddGoal} className="p-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg shadow space-y-3">
        <Input
          type="text"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          placeholder="Define your grand ambition..."
          className="text-lg"
          wrapperClassName="mb-0"
          required
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input
            type="date"
            value={newGoalDeadline}
            onChange={(e) => setNewGoalDeadline(e.target.value)}
            label="Target Date (Optional)"
            wrapperClassName="mb-0 flex-grow"
          />
          <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto" leftIcon={<PlusIcon className="w-5 h-5"/>}>
            Set Goal
          </Button>
        </div>
      </form>

      {sortedGoals.length === 0 && <p className="text-center text-text-muted-light dark:text-text-muted-dark py-4">No grand quests defined yet. What will you achieve?</p>}

      <ul className="space-y-4">
        {sortedGoals.map(goal => (
          <li key={goal.id} className="p-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-lg text-text-light dark:text-text-dark">{goal.text}</span>
              <div className="flex space-x-1.5">
                <Button onClick={() => handleEditGoal(goal)} variant="ghost" size="sm" className="!p-1.5" aria-label="Edit goal"><PencilIcon className="w-4 h-4" /></Button>
                <Button onClick={() => handleDeleteGoal(goal.id)} variant="ghost" size="sm" className="!p-1.5 !text-red-500 hover:!bg-red-500/10" aria-label="Delete goal"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            </div>
            {goal.deadline && <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>}
            
            <div className="flex items-center gap-3 my-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={goal.progress} 
                onChange={(e) => handleProgressChange(goal.id, parseInt(e.target.value))} 
                className="w-full h-2.5 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-light"
                aria-label={`Progress for goal ${goal.text}`} 
              />
              <span className="text-sm font-semibold text-primary dark:text-primary-light w-10 text-right">{goal.progress}%</span>
            </div>
             <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-secondary to-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${goal.progress}%` }}
                ></div>
            </div>
            {goal.progress === 100 && <p className="text-sm text-green-500 dark:text-green-400 font-semibold mt-2">Mission Accomplished! 🎉</p>}
          </li>
        ))}
      </ul>
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingGoal(null)}>
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-xl w-full max-w-lg text-left animate-slideInUp" onClick={e => e.stopPropagation()}>
            <h4 className="text-xl font-zen-dots text-primary dark:text-primary-light mb-4">Edit Goal</h4>
            <Input
              label="Goal Description"
              name="text"
              value={editingGoal.text}
              onChange={handleEditingGoalChange}
              className="mb-3"
            />
             <Input
              label="Deadline"
              type="date"
              name="deadline"
              value={editingGoal.deadline || ''}
              onChange={handleEditingGoalChange}
              wrapperClassName="mb-3"
            />
            <div>
              <label htmlFor="editProgress" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Progress ({editingGoal.progress}%)</label>
              <input 
                type="range" 
                id="editProgress"
                name="progress"
                min="0" 
                max="100" 
                value={editingGoal.progress} 
                onChange={handleEditingGoalChange} 
                className="w-full h-2.5 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-light"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={() => setEditingGoal(null)} variant="ghost">Cancel</Button>
              <Button onClick={handleSaveEdit} variant="primary">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsManager;
