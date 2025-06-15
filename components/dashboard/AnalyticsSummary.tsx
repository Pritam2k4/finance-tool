
import React from 'react';
import { UserData, TodoTask, PomodoroStat } from '../../types';
import Card from '../common/Card';
import ActivityRadarChart from '../charts/ActivityRadarChart'; // Assuming this will be used here

interface AnalyticsSummaryProps {
  userData: UserData;
  userName: string;
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ userData, userName }) => {
  const totalPomodoroSessions = userData.pomodoroStats.reduce((sum, stat) => sum + stat.sessionsCompleted, 0);
  const totalStudyTimeMinutes = userData.pomodoroStats.reduce((sum, stat) => sum + stat.totalWorkTime, 0);
  const totalStudyTimeHours = (totalStudyTimeMinutes / 60).toFixed(1);

  const completedTasks = userData.todos.filter(task => task.completed).length;
  const totalTasks = userData.todos.length;
  const plannerCompletionPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

  // GitHub-style streak graph (mock data for last 30 days)
  const today = new Date();
  const streakData = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const activityLevel = Math.floor(Math.random() * 5); // 0 (no activity) to 4 (high activity)
    return { date: date.toISOString().split('T')[0], level: activityLevel };
  }).reverse();
  
  const levelColors: { [key: number]: string } = {
    0: 'bg-gray-200 dark:bg-gray-700',
    1: 'bg-green-200 dark:bg-green-800',
    2: 'bg-green-400 dark:bg-green-600',
    3: 'bg-green-600 dark:bg-green-400',
    4: 'bg-green-800 dark:bg-green-200',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Pomodoro Power">
          <p className="text-3xl font-bold text-primary dark:text-primary-light">{totalPomodoroSessions}</p>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Total Sessions Completed</p>
        </Card>
        <Card title="Study Hours">
          <p className="text-3xl font-bold text-secondary dark:text-secondary-light">{totalStudyTimeHours} <span className="text-lg">hrs</span></p>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Total Focused Study Time</p>
        </Card>
        <Card title="Planner Progress">
          <p className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">{plannerCompletionPercentage}%</p>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Tasks Conquered ({completedTasks}/{totalTasks})</p>
        </Card>
      </div>

      <Card title="Activity Focus (Radar)">
         <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2 text-center">Illustrative data showing distribution of efforts.</p>
        <ActivityRadarChart />
      </Card>

      <Card title="Consistency Streak (Last 90 Days)">
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">Each square represents a day. Darker green means more activity.</p>
        <div className="grid grid-cols-15 md:grid-cols-20 lg:grid-cols-30 gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded">
          {streakData.map(day => (
            <div 
              key={day.date} 
              title={`${new Date(day.date).toLocaleDateString()}: Level ${day.level} activity`}
              className={`w-full aspect-square rounded-sm ${levelColors[day.level]}`}
            ></div>
          ))}
        </div>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2 text-center">Mock data. Actual streak tracking would require daily check-ins.</p>
      </Card>
      
      {/* Placeholder for achievement system */}
      <Card title="Achievements Unlocked">
        <p className="text-center text-text-muted-light dark:text-text-muted-dark py-4">No achievements yet. Keep striving, warrior!</p>
        {/* Example: <span className="px-3 py-1 bg-yellow-400 text-yellow-800 rounded-full text-sm font-semibold">Study Streak Master</span> */}
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
