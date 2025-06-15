
import { User, UserData, PomodoroSettings, Playlist, MusicTrack, AmbientSound, TodoTask, TestScore, Goal, JournalEntry, DailyReflection, PomodoroStat } from './types';
import React from 'react'; // Required for JSX in AmbientSound icon

// Placeholder icons, replace with actual SVGs or HeroIcons
const PlaceholderIcon: React.FC<{ className?: string }> = ({ className }) => <div className={`w-5 h-5 ${className}`}>🔊</div>;


export const USERS: { [key: string]: User } = {
  akhilesh: {
    id: 'akhilesh',
    name: 'Akhilesh',
    passwordPlain: 'akhilesh123', // For demo only
    profileImage: 'https://picsum.photos/seed/akhilesh/200/200',
    themeColors: { primary: 'violet-600', secondary: 'pink-600' },
  },
  preetam: {
    id: 'preetam',
    name: 'Preetam',
    passwordPlain: 'preetam123', // For demo only
    profileImage: 'https://picsum.photos/seed/preetam/200/200',
    themeColors: { primary: 'sky-600', secondary: 'emerald-600' },
  },
};

export const MOTIVATIONAL_QUOTES: string[] = [
  "Believe in the me that believes in you!", // Gurren Lagann
  "Hard work betrays none, but dreams betray many.", // Hachiman Hikigaya
  "If you don’t take risks, you can’t create a future!", // Monkey D. Luffy
  "Push through the pain, giving up hurts more.", // Vegeta
  "The moment you think of giving up, think of the reason why you held on so long.", // Natsu Dragneel
  "To know sorrow is not terrifying. What is terrifying is to know you can't go back to happiness you could have.", // Matsumoto Rangiku
  "It's not the face that makes someone a monster, it's the choices they make with their lives.", // Naruto Uzumaki
];

const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
};

const AKHILESH_PLAYLISTS: Playlist[] = [
  { id: 'ap1', name: 'Akhilesh\'s Focus Beats', tracks: [
    { id: 'at1', title: 'Samurai Champloo Lofi', artist: 'Nujabes Tribute', albumArt: 'https://picsum.photos/seed/album1/100/100' },
    { id: 'at2', title: 'Ghibli Jazz', artist: 'Studio Ghibli Mix', albumArt: 'https://picsum.photos/seed/album2/100/100' },
  ]},
];

const PREETAM_PLAYLISTS: Playlist[] = [
  { id: 'pp1', name: 'Preetam\'s Power Up Mix', tracks: [
    { id: 'pt1', title: 'Attack on Titan OST Remix', artist: 'Hiroyuki Sawano Fan', albumArt: 'https://picsum.photos/seed/album3/100/100' },
    { id: 'pt2', title: 'Naruto Shippuden Themes', artist: 'Anime Soundtracks', albumArt: 'https://picsum.photos/seed/album4/100/100' },
  ]},
];

export const AMBIENT_SOUNDS: AmbientSound[] = [
    { id: 'rain', name: 'Rain', icon: <PlaceholderIcon /> },
    { id: 'forest', name: 'Forest Dojo', icon: <PlaceholderIcon /> },
    { id: 'library', name: 'Quiet Library', icon: <PlaceholderIcon /> },
];


export const INITIAL_USER_DATA: UserData = {
  todos: [] as TodoTask[],
  scores: [] as TestScore[],
  goals: [] as Goal[],
  journalEntries: [] as JournalEntry[],
  dailyReflections: [] as DailyReflection[],
  pomodoroStats: [] as PomodoroStat[],
  pomodoroSettings: DEFAULT_POMODORO_SETTINGS,
  playlists: [], // Will be populated per user
  notes: '',
};

export const INITIAL_AKHILESH_DATA: UserData = {
  ...INITIAL_USER_DATA,
  playlists: AKHILESH_PLAYLISTS,
  // Sample data for Akhilesh for initial view
  todos: [
    { id: 'a_todo_1', text: 'Review React Hooks', completed: false, priority: 'High', dueTime: '10:00', createdAt: Date.now() },
    { id: 'a_todo_2', text: 'Work on project proposal', completed: true, priority: 'Medium', dueTime: '14:00', createdAt: Date.now() - 86400000 },
  ],
  scores: [
    { id: 'a_score_1', testName: 'Midterm 1', score: 85, maxScore: 100, date: '2024-07-01' },
    { id: 'a_score_2', testName: 'Quiz 3', score: 90, maxScore: 100, date: '2024-07-15' },
  ],
  goals: [
      { id: 'a_goal_1', text: 'Complete 10 LeetCode problems', progress: 20, deadline: '2024-08-30', createdAt: Date.now() }
  ]
};

export const INITIAL_PREETAM_DATA: UserData = {
  ...INITIAL_USER_DATA,
  playlists: PREETAM_PLAYLISTS,
   // Sample data for Preetam for initial view
  todos: [
    { id: 'p_todo_1', text: 'Data Structures practice', completed: false, priority: 'High', dueTime: '11:00', createdAt: Date.now() },
    { id: 'p_todo_2', text: 'Read research paper', completed: false, priority: 'Medium', dueTime: '16:00', createdAt: Date.now() - 86400000 },
  ],
  scores: [
    { id: 'p_score_1', testName: 'Midterm 1', score: 88, maxScore: 100, date: '2024-07-01' },
    { id: 'p_score_2', testName: 'Quiz 3', score: 78, maxScore: 100, date: '2024-07-15' },
  ],
  goals: [
      { id: 'p_goal_1', text: 'Build a full-stack app', progress: 10, deadline: '2024-09-30', createdAt: Date.now() }
  ]
};

// For 4 months, bi-weekly (approx 8 entries if one test every two weeks)
// This is the line that ensures MAX_TEST_ENTRIES is exported.
export const MAX_TEST_ENTRIES = 10; // For 4 months, bi-weekly

