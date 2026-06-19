import { useAppStore } from '@/store/appStore';
import { Snowflake, Flame, ThumbsUp, Vote, Download, Loader2 } from 'lucide-react';

export default function StatsCards() {
  const { currentLineStats, heatmapDimension, exportStats, exportLoading } = useAppStore();

  if (!currentLineStats) return null;

  const isCarriageView = heatmapDimension === 'carriage';

  const getColdestLabel = () => {
    if (isCarriageView) {
      return `${currentLineStats.coldestCarriage}号车厢`;
    }
    const section = currentLineStats.stationSections.find(
      (s) => s.sectionId === currentLineStats.coldestSection,
    );
    return section?.sectionName || '-';
  };

  const getHottestLabel = () => {
    if (isCarriageView) {
      return `${currentLineStats.hottestCarriage}号车厢`;
    }
    const section = currentLineStats.stationSections.find(
      (s) => s.sectionId === currentLineStats.hottestSection,
    );
    return section?.sectionName || '-';
  };

  const stats = [
    {
      label: '总投票数',
      value: currentLineStats.totalVotes,
      icon: Vote,
      color: 'from-metro-blue to-metro-lightBlue',
      iconColor: 'text-metro-lightBlue',
    },
    {
      label: isCarriageView ? '最冷车厢' : '最冷站点段',
      value: getColdestLabel(),
      icon: Snowflake,
      color: 'from-blue-600 to-cyan-400',
      iconColor: 'text-cyan-400',
    },
    {
      label: isCarriageView ? '最闷车厢' : '最闷站点段',
      value: getHottestLabel(),
      icon: Flame,
      color: 'from-orange-600 to-amber-400',
      iconColor: 'text-orange-400',
    },
    {
      label: '舒适率',
      value: `${currentLineStats.comfortRate}%`,
      icon: ThumbsUp,
      color: 'from-emerald-600 to-green-400',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-400">统计概览</h2>
        <button
          onClick={exportStats}
          disabled={exportLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-metro-card border border-metro-border text-slate-300 hover:border-metro-blue/50 hover:text-metro-lightBlue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {exportLoading ? '导出中...' : '导出CSV'}
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="animate-slide-up relative overflow-hidden bg-metro-card border border-metro-border rounded-xl p-4 group hover:border-metro-blue/30 transition-all"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500`} />
              <div className="relative z-10">
                <div className={`w-9 h-9 rounded-lg bg-metro-border/50 flex items-center justify-center mb-3 ${stat.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                <div className={`text-xl sm:text-2xl font-bold font-display bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
