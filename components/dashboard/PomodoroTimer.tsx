
import React, { useState, useEffect, useCallback } from 'react';
import { PomodoroSettings, PomodoroStat } from '../../types';
import Button from '../common/Button';

// Placeholder for icons, replace with actual SVGs
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const ResetIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>;
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69-.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2 3.46c.13-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>;


interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onSettingsChange: (newSettings: PomodoroSettings) => void;
  onSessionComplete: (sessionType: 'work' | 'break', duration: number) => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ settings, onSettingsChange, onSessionComplete }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editableSettings, setEditableSettings] = useState<PomodoroSettings>(settings);

  // Audio for notification - use cautiously as it can be annoying
  const notificationSound = typeof Audio !== "undefined" ? new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU0AAAAAAP//") : null; // Simple beep

  const resetTimer = useCallback(() => {
    setIsActive(false);
    let newTime;
    switch (mode) {
      case 'work': newTime = settings.workDuration * 60; break;
      case 'shortBreak': newTime = settings.shortBreakDuration * 60; break;
      case 'longBreak': newTime = settings.longBreakDuration * 60; break;
      default: newTime = settings.workDuration * 60;
    }
    setTimeLeft(newTime);
  }, [mode, settings]);

  useEffect(() => {
    resetTimer();
    setEditableSettings(settings); // Sync editable settings when main settings prop changes
  }, [settings, resetTimer]);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      notificationSound?.play().catch(e => console.warn("Audio play failed:", e));
      setIsActive(false);
      const completedDuration = mode === 'work' ? settings.workDuration : (mode === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration);
      onSessionComplete(mode === 'work' ? 'work' : 'break', completedDuration);

      if (mode === 'work') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        setMode(newCycles % settings.cyclesBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak');
      } else {
        setMode('work');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, cycles, settings, onSessionComplete, notificationSound]);
  
  useEffect(() => { // Effect to reset timer when mode changes
    resetTimer();
  }, [mode, resetTimer]);


  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = (): number => {
    switch (mode) {
      case 'work': return settings.workDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
      default: return settings.workDuration * 60;
    }
  };

  const progressPercentage = (totalDuration() - timeLeft) / totalDuration() * 100;

  const handleSettingsSave = () => {
    onSettingsChange(editableSettings);
    setShowSettingsModal(false);
  };
  
  const modeTexts = {
    work: "Focus Time!",
    shortBreak: "Quick Break!",
    longBreak: "Extended Rest!"
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-md text-center relative">
      <h3 className="text-2xl font-zen-dots text-primary dark:text-primary-light mb-2">{modeTexts[mode]}</h3>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Cycle {cycles + 1} / {settings.cyclesBeforeLongBreak} (before long break)</p>
      
      <div className="my-6">
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-300 dark:text-gray-600"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            {/* Progress circle - "Chakra Bar" style */}
            <circle
              className="text-secondary dark:text-secondary-light transition-all duration-500"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={(2 * Math.PI * 40) * (1 - progressPercentage / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-zen-dots text-text-light dark:text-text-dark">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-3">
        <Button onClick={toggleTimer} variant={isActive ? "secondary" : "primary"} size="lg">
          {isActive ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          <span className="ml-2">{isActive ? 'Pause' : 'Start'}</span>
        </Button>
        <Button onClick={resetTimer} variant="ghost" size="lg">
          <ResetIcon className="w-6 h-6" />
          <span className="ml-2">Reset</span>
        </Button>
      </div>
      
      <Button 
        onClick={() => setShowSettingsModal(true)} 
        variant="ghost" 
        size="sm" 
        className="absolute top-4 right-4 !p-2"
        aria-label="Timer Settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </Button>

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-xl w-full max-w-md text-left animate-slideInUp" onClick={e => e.stopPropagation()}>
            <h4 className="text-xl font-zen-dots text-primary dark:text-primary-light mb-4">Timer Settings</h4>
            <div className="space-y-3">
              {(Object.keys(editableSettings) as Array<keyof PomodoroSettings>).map(key => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-text-light dark:text-text-dark">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} (minutes)
                  </label>
                  <input
                    type="number"
                    id={key}
                    value={editableSettings[key]}
                    onChange={e => setEditableSettings({...editableSettings, [key]: parseInt(e.target.value, 10) || 0})}
                    className="mt-1 w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary-light"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={() => setShowSettingsModal(false)} variant="ghost">Cancel</Button>
              <Button onClick={handleSettingsSave} variant="primary">Save Settings</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
