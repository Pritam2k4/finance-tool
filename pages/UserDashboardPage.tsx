
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserData, DashboardTab, PomodoroSettings, TodoTask, TestScore, Goal, JournalEntry, DailyReflection, PomodoroStat } from '../types';
import { INITIAL_AKHILESH_DATA, INITIAL_PREETAM_DATA } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import useAuth from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import Button from '../components/common/Button';

// Dashboard components
import TodoList from '../components/dashboard/TodoList';
import ScoreTracker from '../components/dashboard/ScoreTracker';
import MusicPlayer from '../components/dashboard/MusicPlayer';
import GoalsManager from '../components/dashboard/GoalsManager';
import Journal from '../components/dashboard/Journal';
import AnalyticsSummary from '../components/dashboard/AnalyticsSummary';
import PomodoroTimer from '../components/dashboard/PomodoroTimer';
import DailyReflectionLog from '../components/dashboard/DailyReflection'; // Renamed for clarity

// Placeholder Icons for Tabs
const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>;
const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>;
const MusicalNoteIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9c0-1.355.694-2.165 2.013-2.624C12.023 5.97 13.003 5.5 14.003 5.5c1.999 0 3.998.99 3.998 2.998v3.002A2.998 2.998 0 0 1 15 14.501H9.002A2.998 2.998 0 0 1 6 11.503v-1.001c0-1.654.886-2.435 2.013-2.89BC9.023 7.03 9 7.5 9 9Z" /></svg>;
const FlagIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" /></svg>;
const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V21M12 6.042A8.967 8.967 0 0 1 18 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 1-6-2.292m0 0H6m6 12.75a8.967 8.967 0 0 1-6 2.292A8.967 8.967 0 0 1 3 18.75V4.5c1.052-.332 2.062-.512 3-.512A8.966 8.966 0 0 1 12 6.042Zm0 12.75a8.966 8.966 0 0 0 6-2.292A8.966 8.966 0 0 0 21 18.75V4.5c-1.052-.332-2.062-.512-3-.512a8.967 8.967 0 0 0-6 2.292Z" /></svg>;
const PresentationChartLineIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 14.25m-1.5 0h15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;


interface UserDashboardPageProps {
  user: User;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ user }) => {
  const initialData = user.id === 'akhilesh' ? INITIAL_AKHILESH_DATA : INITIAL_PREETAM_DATA;
  const [userData, setUserData] = useLocalStorage<UserData>(`${user.id}_data`, initialData);
  const { isAuthenticated, login, logout, isLoading: authIsLoading } = useAuth(user);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.Planner);

  const handleAuthenticated = () => {
    // Auth logic handled by useAuth hook, this callback confirms successful auth from modal
    // Could potentially trigger a data refresh here if not using localStorage directly
  };

  const updateUserData = <K extends keyof UserData,>(key: K, value: UserData[K]) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayReflection = useMemo(() => {
    return userData.dailyReflections.find(r => r.date === todayISO);
  }, [userData.dailyReflections, todayISO]);

  const handleSaveReflection = (reflectionData: { wentWell: string; toImprove: string }) => {
    const existingReflectionIndex = userData.dailyReflections.findIndex(r => r.date === todayISO);
    let updatedReflections: DailyReflection[];
    if (existingReflectionIndex > -1) {
      updatedReflections = userData.dailyReflections.map((r, index) => 
        index === existingReflectionIndex ? { ...r, ...reflectionData } : r
      );
    } else {
      updatedReflections = [...userData.dailyReflections, { date: todayISO, ...reflectionData }];
    }
    updateUserData('dailyReflections', updatedReflections);
  };
  
  const handlePomodoroSessionComplete = (sessionType: 'work' | 'break', duration: number) => {
    if (sessionType === 'work') {
        const today = new Date().toISOString().split('T')[0];
        const existingStatIndex = userData.pomodoroStats.findIndex(s => s.date === today);
        let updatedStats: PomodoroStat[];

        if (existingStatIndex > -1) {
            updatedStats = userData.pomodoroStats.map((stat, index) => 
                index === existingStatIndex 
                ? { ...stat, sessionsCompleted: stat.sessionsCompleted + 1, totalWorkTime: stat.totalWorkTime + duration }
                : stat
            );
        } else {
            updatedStats = [...userData.pomodoroStats, { date: today, sessionsCompleted: 1, totalWorkTime: duration }];
        }
        updateUserData('pomodoroStats', updatedStats);
    }
  };


  if (authIsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner text={`Loading ${user.name}'s Dashboard...`} /></div>;
  }

  if (!isAuthenticated) {
    return <AuthModal isOpen={true} onClose={() => {}} onAuthenticated={handleAuthenticated} user={user} />;
  }

  const tabOptions: { label: string; value: DashboardTab; icon: React.ReactNode }[] = [
    { label: 'Planner', value: DashboardTab.Planner, icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { label: 'Timer', value: DashboardTab.Pomodoro, icon: <ClockIcon className="w-5 h-5" /> },
    { label: 'Scores', value: DashboardTab.Scores, icon: <ChartBarIcon className="w-5 h-5" /> },
    { label: 'Music', value: DashboardTab.Music, icon: <MusicalNoteIcon className="w-5 h-5" /> },
    { label: 'Goals', value: DashboardTab.Goals, icon: <FlagIcon className="w-5 h-5" /> },
    { label: 'Journal', value: DashboardTab.Journal, icon: <BookOpenIcon className="w-5 h-5" /> },
    { label: 'Analytics', value: DashboardTab.Analytics, icon: <PresentationChartLineIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
            <img src={user.profileImage} alt={user.name} className="w-16 h-16 rounded-full border-2 border-primary dark:border-primary-light shadow-lg mr-4" />
            <div>
                <h1 className="text-3xl md:text-4xl font-zen-dots text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-secondary-light">
                    {user.name}'s Dashboard
                </h1>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Welcome back, warrior! Time to conquer the day.</p>
            </div>
        </div>
        <Button onClick={logout} variant="danger" size="sm">Logout Realm</Button>
      </header>

      <Tabs 
        options={tabOptions} 
        activeTab={activeTab} 
        onTabChange={(newTab: DashboardTab) => setActiveTab(newTab)} 
        className="mb-2 sticky top-0 z-10 bg-background-light/80 dark:bg-background-darker/80 backdrop-blur-md py-2 -mx-4 md:-mx-8 px-4 md:px-8 shadow-sm" 
      />
      
      <main className="animate-fadeIn">
        {/* Daily Reflection Section - Placed prominently */}
        {activeTab === DashboardTab.Planner && (
             <Card className="mb-6" titleClassName="!text-lg">
                <DailyReflectionLog reflection={todayReflection} onSaveReflection={handleSaveReflection} />
            </Card>
        )}

        {/* Notes Section - Simple text area, perhaps also on Planner tab */}
        {activeTab === DashboardTab.Planner && (
            <Card title="Quick Notes" className="mb-6" titleClassName="!text-lg">
                <textarea
                    value={userData.notes}
                    onChange={(e) => updateUserData('notes', e.target.value)}
                    rows={4}
                    placeholder="Jot down your brilliant ideas or reminders here..."
                    className="w-full p-2.5 rounded-md bg-background-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary-light outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
            </Card>
        )}

        <Card className="min-h-[60vh]">
          {activeTab === DashboardTab.Planner && <TodoList tasks={userData.todos} onTasksChange={(newTasks) => updateUserData('todos', newTasks)} />}
          {activeTab === DashboardTab.Pomodoro && <PomodoroTimer settings={userData.pomodoroSettings} onSettingsChange={(newSettings) => updateUserData('pomodoroSettings', newSettings)} onSessionComplete={handlePomodoroSessionComplete} />}
          {activeTab === DashboardTab.Scores && <ScoreTracker scores={userData.scores} onScoresChange={(newScores) => updateUserData('scores', newScores)} userName={user.name}/>}
          {activeTab === DashboardTab.Music && <MusicPlayer playlists={userData.playlists} userName={user.name} />}
          {activeTab === DashboardTab.Goals && <GoalsManager goals={userData.goals} onGoalsChange={(newGoals) => updateUserData('goals', newGoals)} />}
          {activeTab === DashboardTab.Journal && <Journal entries={userData.journalEntries} onEntriesChange={(newEntries) => updateUserData('journalEntries', newEntries)} />}
          {activeTab === DashboardTab.Analytics && <AnalyticsSummary userData={userData} userName={user.name}/>}
        </Card>
      </main>
       <footer className="mt-12 text-center text-xs text-text-muted-light dark:text-text-muted-dark">
        <p>Keep pushing your limits, {user.name}! Your legend is waiting to be written.</p>
      </footer>
    </div>
  );
};

export default UserDashboardPage;
