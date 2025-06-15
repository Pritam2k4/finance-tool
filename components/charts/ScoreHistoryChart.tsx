
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TestScore } from '../../types';

interface ScoreHistoryChartProps {
  scores: TestScore[];
  userName: string;
}

const ScoreHistoryChart: React.FC<ScoreHistoryChartProps> = ({ scores, userName }) => {
  if (scores.length === 0) {
    return <p className="text-center text-text-muted-light dark:text-text-muted-dark py-4">No scores recorded yet to display chart.</p>;
  }

  const chartData = scores.map(s => ({
    name: s.testName.length > 15 ? `${s.testName.substring(0,12)}...` : s.testName, // Shorten long names
    score: s.score,
    date: s.date,
    maxScore: s.maxScore,
  })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'currentColor', fontSize: 10 }} 
            angle={-30} 
            textAnchor="end"
            height={50} // Adjust height to accommodate angled labels
            interval={0} // Show all labels if space allows
          />
          <YAxis domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string, props: any) => [`${value}/${props.payload.maxScore}`, `Score on ${props.payload.date}`]}
            contentStyle={{ 
              backgroundColor: 'rgba(31, 41, 55, 0.9)', 
              borderColor: '#4B5563', 
              borderRadius: '0.5rem',
              color: '#F3F4F6'
            }}
            cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Legend wrapperStyle={{ color: 'currentColor', paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            dataKey="score" 
            name={`${userName}'s Score`} 
            stroke="url(#scoreGradient)" 
            strokeWidth={3} 
            dot={{ r: 5, strokeWidth: 2, fill: 'var(--color-primary-dark)' }}
            activeDot={{ r: 7, strokeWidth: 2, fill: 'var(--color-primary-light)' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreHistoryChart;
