import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Scenario } from '../types';

interface Props {
  scenarios: Scenario[];
}

export const ScenarioChart: React.FC<Props> = ({ scenarios }) => {
  const data = scenarios.map(s => ({
    name: s.title.length > 15 ? s.title.substring(0, 15) + '...' : s.title,
    fullTitle: s.title,
    prob: s.probability,
    impact: s.impact_level,
  }));

  const getColor = (impact: string) => {
    switch (impact) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
            formatter={(value: number) => [`${value}%`, 'Probability']}
          />
          <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.impact)} />
            ))}
          </Bar>
          <ReferenceLine x={50} stroke="#334155" strokeDasharray="3 3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};