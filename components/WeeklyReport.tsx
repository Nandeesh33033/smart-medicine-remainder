
import React from 'react';
import type { Log, Medicine } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyReportProps {
  logs: Log[];
  medicines: Medicine[];
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ logs, medicines }) => {
  const processData = () => {
    const dataByDay: { [key: string]: { name: string; taken: number; missed: number } } = {};
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = weekDays[d.getDay()];
      dataByDay[dayName] = { name: dayName, taken: 0, missed: 0 };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const relevantLogs = logs.filter(log => log.timestamp > sevenDaysAgo);

    relevantLogs.forEach(log => {
      const dayName = weekDays[log.timestamp.getDay()];
      if (dataByDay[dayName]) {
        if (log.status === 'taken') {
          dataByDay[dayName].taken++;
        } else {
          dataByDay[dayName].missed++;
        }
      }
    });

    return Object.values(dataByDay);
  };

  const data = processData();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Weekly Adherence Report</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="taken" fill="#4ade80" name="Doses Taken" />
            <Bar dataKey="missed" fill="#f87171" name="Doses Missed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyReport;
