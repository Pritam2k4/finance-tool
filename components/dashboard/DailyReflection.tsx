
import React, { useState, useEffect } from 'react';
import { DailyReflection as ReflectionType } from '../../types';
import Button from '../common/Button';

interface DailyReflectionProps {
  reflection: ReflectionType | undefined; // Today's reflection
  onSaveReflection: (reflectionData: { wentWell: string; toImprove: string }) => void;
}

const DailyReflection: React.FC<DailyReflectionProps> = ({ reflection, onSaveReflection }) => {
  const [wentWell, setWentWell] = useState('');
  const [toImprove, setToImprove] = useState('');
  const [isEditing, setIsEditing] = useState(true); // Start in editing mode if no reflection exists for today

  useEffect(() => {
    if (reflection) {
      setWentWell(reflection.wentWell);
      setToImprove(reflection.toImprove);
      setIsEditing(false); // If reflection exists, start in view mode
    } else {
      setWentWell('');
      setToImprove('');
      setIsEditing(true); // No reflection, start in edit mode
    }
  }, [reflection]);

  const handleSave = () => {
    if (wentWell.trim() || toImprove.trim()) { // Save even if one field is empty
        onSaveReflection({ wentWell: wentWell.trim(), toImprove: toImprove.trim() });
        setIsEditing(false);
    } else {
        alert("Please fill at least one field for your reflection.");
    }
  };

  return (
    <div className="p-4 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm rounded-lg shadow">
      <h3 className="text-lg font-zen-dots text-primary dark:text-primary-light mb-3">Daily Reflection Log</h3>
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="wentWell" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
              What went well today, warrior?
            </label>
            <textarea
              id="wentWell"
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              rows={3}
              className="w-full p-2 rounded-md bg-background-light dark:bg-gray-600 border border-gray-300 dark:border-gray-500 focus:ring-primary dark:focus:ring-primary-light outline-none"
              placeholder="e.g., Crushed my study goals, helped a friend..."
            />
          </div>
          <div>
            <label htmlFor="toImprove" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
              What will you conquer tomorrow? (Areas for improvement)
            </label>
            <textarea
              id="toImprove"
              value={toImprove}
              onChange={(e) => setToImprove(e.target.value)}
              rows={3}
              className="w-full p-2 rounded-md bg-background-light dark:bg-gray-600 border border-gray-300 dark:border-gray-500 focus:ring-primary dark:focus:ring-primary-light outline-none"
              placeholder="e.g., Manage time better, start on tasks earlier..."
            />
          </div>
          <Button onClick={handleSave} variant="primary" className="w-full sm:w-auto">
            Save Reflection
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">Victories Today:</h4>
            <p className="text-text-light dark:text-text-dark whitespace-pre-wrap p-2 bg-green-500/10 dark:bg-green-400/10 rounded-md">
              {reflection?.wentWell || "No wins recorded for today."}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">Next Challenge:</h4>
            <p className="text-text-light dark:text-text-dark whitespace-pre-wrap p-2 bg-yellow-500/10 dark:bg-yellow-400/10 rounded-md">
              {reflection?.toImprove || "No areas for improvement noted."}
            </p>
          </div>
          <Button onClick={() => setIsEditing(true)} variant="secondary" className="w-full sm:w-auto">
            Edit Today's Reflection
          </Button>
        </div>
      )}
    </div>
  );
};

export default DailyReflection;
