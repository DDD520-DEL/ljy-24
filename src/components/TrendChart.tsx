import { useAppStore } from '@/store/appStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatHour } from '@/utils/heatmap';
import { TrendingUp } from 'lucide-react';

export default function TrendChart() {
  const { currentTrend } = useAppStore();

  const data = currentTrend
    .filter((d) => d.coldCount + d.comfortableCount + d.hotCount > 0)
    .map((d) => ({
      hour: formatHour(d.hour),
      冻僵: d.coldCount,
      舒适: d.comfortableCount,
      闷热: d.hotCount,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-metro-card border border-metro-border rounded-2xl p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-metro-border flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-slate-500" />
        </div>
        <p className="text-slate-500 text-sm">暂无趋势数据</p>
      </div>
    );
  }

  return (
    <div className="bg-metro-card border border-metro-border rounded-2xl p-4 sm:p-6 animate-fade-in">
      <h3 className="font-display font-bold text-lg text-white mb-4">今日时段趋势</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="coldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="comfortGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="hotGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#F1F5F9',
                fontSize: '13px',
              }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="冻僵"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#coldGrad)"
            />
            <Area
              type="monotone"
              dataKey="舒适"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#comfortGrad)"
            />
            <Area
              type="monotone"
              dataKey="闷热"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#hotGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
