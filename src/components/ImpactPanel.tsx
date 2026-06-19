import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Vote, Route, Users, Sparkles, Loader2 } from 'lucide-react';

export default function ImpactPanel() {
  const { userImpactStats, userImpactLoading, fetchUserImpactStats } = useAppStore();

  useEffect(() => {
    fetchUserImpactStats();
  }, [fetchUserImpactStats]);

  const stats = [
    {
      label: '累计投票',
      value: userImpactStats?.totalVotes ?? 0,
      suffix: '次',
      icon: Vote,
      color: 'from-metro-blue to-metro-lightBlue',
      iconColor: 'text-metro-lightBlue',
      description: '你为温度数据贡献的力量',
    },
    {
      label: '覆盖线路',
      value: userImpactStats?.linesCovered ?? 0,
      suffix: '条',
      icon: Route,
      color: 'from-violet-600 to-purple-400',
      iconColor: 'text-violet-400',
      description: '你参与过的地铁线路',
    },
    {
      label: '帮助他人',
      value: userImpactStats?.helpCount ?? 0,
      suffix: '次',
      icon: Users,
      color: 'from-emerald-600 to-teal-400',
      iconColor: 'text-emerald-400',
      description: '你的投票被他人查阅的次数',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-medium text-slate-400">我的影响力</h2>
        {userImpactLoading && <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="animate-slide-up relative overflow-hidden bg-metro-card border border-metro-border rounded-xl p-3 sm:p-4 group hover:border-metro-blue/30 transition-all"
            >
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-125 transition-transform duration-500`}
              />
              <div className="relative z-10">
                <div
                  className={`w-8 h-8 rounded-lg bg-metro-border/50 flex items-center justify-center mb-2 ${stat.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-400 mb-0.5">{stat.label}</div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-lg sm:text-xl font-bold font-display bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {userImpactLoading ? '-' : stat.value}
                  </span>
                  <span className="text-xs text-slate-500">{stat.suffix}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 hidden sm:block">
                  {stat.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
