
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PomodoroStat } from '../../types'; // For potential future use

interface ActivityRadarChartProps {
  // pomodoroStats: PomodoroStat[]; // Example data source
  // taskCompletionData: any; // Example data source
}

// Placeholder data
const data = [
  { subject: 'Study', A: 120, fullMark: 150 },
  { subject: 'Coding', A: 98, fullMark: 150 },
  { subject: 'Reading', A: 86, fullMark: 150 },
  { subject: 'Exercise', A: 99, fullMark: 150 },
  { subject: 'Hobbies', A: 85, fullMark: 150 },
  { subject: 'Rest', A: 65, fullMark: 150 },
];

const ActivityRadarChart: React.FC<ActivityRadarChartProps> = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          <PolarGrid strokeOpacity={0.3} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: 'currentColor', fontSize: 10 }} />
          <Radar name="Activity Focus" dataKey="A" stroke="var(--color-primary-light)" fill="url(#radarFill)" fillOpacity={0.7} />
          <Legend wrapperStyle={{ color: 'currentColor' }} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                borderColor: '#4B5563', 
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityRadarChart;
