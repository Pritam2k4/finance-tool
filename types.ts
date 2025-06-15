
export interface User {
  id: string;
  name: string;
  passwordPlain: string; // In a real app, use hashed passwords
  profileImage: string;
  themeColors: {
    primary: string;
    secondary: string;
  };
}

export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  dueTime?: string; // HH:mm format
  createdAt: number; // Timestamp
}

export interface TestScore {
  id: string;
  testName: string;
  score: number;
  maxScore: number;
  date: string; // YYYY-MM-DD
}

export interface Goal {
  id: string;
  text: string;
  progress: number; // 0-100
  deadline?: string; // YYYY-MM-DD
  createdAt: number; // Timestamp
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  entry: string;
  createdAt: number; // Timestamp
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  wentWell: string;
  toImprove: string;
}

export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  cyclesBeforeLongBreak: number;
}

export interface PomodoroStat {
  date: string; // YYYY-MM-DD
  sessionsCompleted: number;
  totalWorkTime: number; // minutes
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  src?: string; // URL to audio file (mock)
}

export interface Playlist {
  id: string;
  name: string;
  tracks: MusicTrack[];
}

export interface AmbientSound {
  id: string;
  name: string;
  icon: React.ReactNode; // e.g. <RainIcon />
}

export interface UserData {
  todos: TodoTask[];
  scores: TestScore[];
  goals: Goal[];
  journalEntries: JournalEntry[];
  dailyReflections: DailyReflection[];
  pomodoroStats: PomodoroStat[];
  pomodoroSettings: PomodoroSettings;
  playlists: Playlist[];
  notes: string;
}

export enum DashboardTab {
  Planner = 'Planner',
  Scores = 'Scores',
  Music = 'Music',
  Goals = 'Goals',
  Journal = 'Journal',
  Analytics = 'Analytics',
  Pomodoro = 'Timer'
}
