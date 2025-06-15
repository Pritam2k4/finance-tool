
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User } from '../../types'; // Assuming User type is needed for dynamic data in future
import Card from '../common/Card';

interface UserComparisonChartProps {
  // akhileshStats: any; // Replace with actual stats type
  // preetamStats: any; // Replace with actual stats type
}

// Placeholder data - in a real app, this would be fetched or calculated
const comparisonData = [
  { name: 'Tasks Completed', Akhilesh: 75, Preetam: 80, fillAkhilesh: '#8B5CF6', fillPreetam: '#34D399' },
  { name: 'Avg Test Score', Akhilesh: 82, Preetam: 78, fillAkhilesh: '#8B5CF6', fillPreetam: '#34D399' },
  { name: 'Pomodoro Hours', Akhilesh: 40, Preetam: 35, fillAkhilesh: '#8B5CF6', fillPreetam: '#34D399' },
];

const UserComparisonChart: React.FC<UserComparisonChartProps> = () => {
  return (
    <Card title="Warriors' Progress Overview" className="col-span-1 md:col-span-2">
      <div className="h-80 md:h-96 w-full">
         <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                borderColor: '#4B5563', // border-gray-600
                borderRadius: '0.5rem', // rounded-lg
                color: '#F3F4F6' // text-gray-100
              }}
              cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }} // fill-primary with opacity
            />
            <Legend wrapperStyle={{ color: 'currentColor' }} />
            <Bar dataKey="Akhilesh" name="Akhilesh" fill="url(#colorAkhilesh)" barSize={30} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Preetam" name="Preetam" fill="url(#colorPreetam)" barSize={30} radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="colorAkhilesh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.9}/>
              </linearGradient>
              <linearGradient id="colorPreetam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6EE7B7" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.9}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs mt-2 text-text-muted-light dark:text-text-muted-dark">
        Comparative performance metrics. Keep pushing your limits!
      </p>
    </Card>
  );
};

export default UserComparisonChart;
