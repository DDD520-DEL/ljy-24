import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatHour } from '@/utils/heatmap';
import { TrendingUp, Calendar, CalendarDays } from 'lucide-react';
import type { TrendCompareMode } from '../../shared/types.js';

type CompareOption = {
  value: TrendCompareMode;
  label: string;
  icon: React.ReactNode;
};

const compareOptions: CompareOption[] = [
  { value: 'none', label: '今日', icon: <Calendar className="w-3.5 h-3.5" /> },
  { value: 'yesterday', label: '对比昨天', icon: <CalendarDays className="w-3.5 h-3.5" /> },
  { value: 'lastweek', label: '对比上周', icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

const LEVEL_COLORS = {
  cold: '#3B82F6',
  comfortable: '#10B981',
  hot: '#EF4444',
} as const;

const LEVEL_NAMES = {
  cold: '冻僵',
  comfortable: '舒适',
  hot: '闷热',
} as const;

type LevelKey = keyof typeof LEVEL_COLORS;

const LEVELS: LevelKey[] = ['cold', 'comfortable', 'hot'];

function hasTrendData(data: any[] | undefined): boolean {
  if (!data || data.length === 0) return false;
  return data.some(
    (d) => (d.coldCount || 0) + (d.comfortableCount || 0) + (d.hotCount || 0) > 0
  );
}

export default function TrendChart() {
  const { trendComparison, trendCompareMode, setTrendCompareMode } = useAppStore();
  const { current, yesterday, lastWeek } = trendComparison;

  const hasCurrent = hasTrendData(current);
  const hasYesterday = hasTrendData(yesterday);
  const hasLastWeek = hasTrendData(lastWeek);

  const shouldCompare = trendCompareMode !== 'none';

  const chartData = useMemo(() => {
    if (!current || current.length === 0) return [];

    return current.map((curr, idx) => {
      const row: any = {
        hour: formatHour(curr.hour),
        hourNum: curr.hour,
      };

      LEVELS.forEach((level) => {
        const countKey = `${level}Count` as const;
        row[`${LEVEL_NAMES[level]}_今日`] = curr[countKey] || 0;
      });

      if (shouldCompare && yesterday && yesterday[idx]) {
        LEVELS.forEach((level) => {
          const countKey = `${level}Count` as const;
          row[`${LEVEL_NAMES[level]}_昨天`] = yesterday[idx][countKey] || 0;
        });
      }

      if (shouldCompare && lastWeek && lastWeek[idx]) {
        LEVELS.forEach((level) => {
          const countKey = `${level}Count` as const;
          row[`${LEVEL_NAMES[level]}_上周`] = lastWeek[idx][countKey] || 0;
        });
      }

      return row;
    });
  }, [current, yesterday, lastWeek, shouldCompare]);

  const hasAnyData = chartData.some((row) => {
    return Object.entries(row).some(
      ([key, val]) => !key.startsWith('hour') && typeof val === 'number' && val > 0
    );
  });

  if (!hasCurrent || !hasAnyData) {
    return (
      <div className="bg-metro-card border border-metro-border rounded-2xl p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-metro-border flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-slate-500" />
        </div>
        <p className="text-slate-500 text-sm">暂无趋势数据</p>
      </div>
    );
  }

  const renderLines = () => {
    const lines: React.ReactNode[] = [];

    LEVELS.forEach((level) => {
      const color = LEVEL_COLORS[level];
      const name = LEVEL_NAMES[level];

      lines.push(
        <Line
          key={`${level}-today`}
          type="monotone"
          dataKey={`${name}_今日`}
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      );

      if (shouldCompare) {
        if (hasYesterday) {
          lines.push(
            <Line
              key={`${level}-yesterday`}
              type="monotone"
              dataKey={`${name}_昨天`}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="5 5"
              strokeOpacity={0.6}
              dot={false}
            />
          );
        }
        if (hasLastWeek) {
          lines.push(
            <Line
              key={`${level}-lastweek`}
              type="monotone"
              dataKey={`${name}_上周`}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="2 4"
              strokeOpacity={0.4}
              dot={false}
            />
          );
        }
      }
    });

    return lines;
  };

  const customLegend = () => {
    const items: { label: string; color: string; dash?: string; opacity?: number }[] = [];

    LEVELS.forEach((level) => {
      const color = LEVEL_COLORS[level];
      const name = LEVEL_NAMES[level];
      items.push({ label: `${name}（今日）`, color });

      if (shouldCompare) {
        if (hasYesterday) {
          items.push({ label: `${name}（昨天）`, color, dash: '5 5', opacity: 0.6 });
        }
        if (hasLastWeek) {
          items.push({ label: `${name}（上周）`, color, dash: '2 4', opacity: 0.4 });
        }
      }
    });

    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <svg width="24" height="12">
              <line
                x1="0"
                y1="6"
                x2="24"
                y2="6"
                stroke={item.color}
                strokeWidth="2.5"
                strokeDasharray={item.dash}
                strokeOpacity={item.opacity ?? 1}
              />
            </svg>
            <span className="text-xs text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-metro-card border border-metro-border rounded-2xl p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="font-display font-bold text-lg text-white">时段温度趋势</h3>

        <div className="flex items-center gap-1 p-1 bg-metro-bg rounded-xl border border-metro-border">
          {compareOptions.map((opt) => {
            const isActive = trendCompareMode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTrendCompareMode(opt.value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${isActive
                    ? 'bg-metro-blue/20 text-metro-lightBlue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-metro-border/50'
                  }
                `}
              >
                {opt.icon}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
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
                fontSize: '12px',
              }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}
              itemStyle={{ padding: '2px 0' }}
            />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {customLegend()}

      {shouldCompare && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <svg width="20" height="8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#94A3B8" strokeWidth="2" />
            </svg>
            <span>实线 = 今日</span>
          </div>
          {hasYesterday && (
            <div className="flex items-center gap-1.5">
              <svg width="20" height="8">
                <line x1="0" y1="4" x2="20" y2="4" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" strokeOpacity="0.6" />
              </svg>
              <span>长虚线 = 昨天</span>
            </div>
          )}
          {hasLastWeek && (
            <div className="flex items-center gap-1.5">
              <svg width="20" height="8">
                <line x1="0" y1="4" x2="20" y2="4" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 4" strokeOpacity="0.4" />
              </svg>
              <span>短虚线 = 上周同天</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
