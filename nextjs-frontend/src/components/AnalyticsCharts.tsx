
import { ChartDataPoint } from '@/types/types';
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';


interface AnalyticsChartsProps {
  data: ChartDataPoint[];
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1f1f1f] border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-xs text-gray-400 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Subscriber & Views Growth */}
      <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
          Views & Audience Growth
          <span className="text-xs font-normal text-gray-500 px-2 py-1 bg-white/5 rounded-md">Last 30 Days</span>
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val: number) => `${(val / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="views" 
                name="Views"
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorViews)" 
              />
              <Area 
                type="monotone" 
                dataKey="subscribers" 
                name="Subs"
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Uploads & Engagement */}
      <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
          Monthly Video Uploads
          <span className="text-xs font-normal text-gray-500 px-2 py-1 bg-white/5 rounded-md">Performance</span>
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="uploads" 
                name="Videos Published"
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Likes Distribution */}
      <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl lg:col-span-2">
        <h3 className="text-lg font-semibold mb-6">Interaction Trends (Likes vs Engagement)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36}/>
              <Line 
                type="monotone" 
                dataKey="likes" 
                name="Likes"
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                name="Relative Views"
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
