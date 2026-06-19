import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import Header from '@/components/Header';
import { History, Clock, Thermometer, ThermometerSnowflake, Flame, Filter, Inbox } from 'lucide-react';
import type { VoteHistoryRecord, TimeSlot } from '../../shared/types.js';
import { getTimeSlotLabel, getHeatBgColor, getHeatLabel } from '@/utils/heatmap';
import { cn } from '@/lib/utils';

const HISTORY_SLOTS: TimeSlot[] = ['all', 'morning', 'evening', 'offpeak'];

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  if (isToday) {
    return `今天 ${timeStr}`;
  } else if (isYesterday) {
    return `昨天 ${timeStr}`;
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${timeStr}`;
  }
}

function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  return `${days} 天前`;
}

function getVoteLevelInfo(level: string) {
  switch (level) {
    case 'cold':
      return {
        label: '冷',
        icon: ThermometerSnowflake,
        bgClass: 'bg-blue-500/20 border-blue-500/40',
        textClass: 'text-blue-400',
        dotClass: 'bg-blue-500',
      };
    case 'comfortable':
      return {
        label: '舒适',
        icon: Thermometer,
        bgClass: 'bg-green-500/20 border-green-500/40',
        textClass: 'text-green-400',
        dotClass: 'bg-green-500',
      };
    case 'hot':
      return {
        label: '热',
        icon: Flame,
        bgClass: 'bg-red-500/20 border-red-500/40',
        textClass: 'text-red-400',
        dotClass: 'bg-red-500',
      };
    default:
      return {
        label: level,
        icon: Thermometer,
        bgClass: 'bg-slate-500/20 border-slate-500/40',
        textClass: 'text-slate-400',
        dotClass: 'bg-slate-500',
      };
  }
}

function SnapshotBar({ record }: { record: VoteHistoryRecord }) {
  const total = record.snapshotTotalCount || 1;
  const coldPct = ((record.snapshotColdCount || 0) / total) * 100;
  const comfortPct = ((record.snapshotComfortableCount || 0) / total) * 100;
  const hotPct = ((record.snapshotHotCount || 0) / total) * 100;
  const score = record.snapshotScore ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">当时评分快照</span>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: getHeatBgColor(score) }}
          >
            {getHeatLabel(score)}
          </span>
          <span className="text-xs font-mono text-slate-300">
            {score > 0 ? '+' : ''}{score}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex bg-metro-border/50">
        {coldPct > 0 && (
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
            style={{ width: `${coldPct}%` }}
          />
        )}
        {comfortPct > 0 && (
          <div
            className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all"
            style={{ width: `${comfortPct}%` }}
          />
        )}
        {hotPct > 0 && (
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
            style={{ width: `${hotPct}%` }}
          />
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {record.snapshotColdCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {record.snapshotComfortableCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {record.snapshotHotCount || 0}
          </span>
        </div>
        <span>共 {record.snapshotTotalCount || 0} 票</span>
      </div>
    </div>
  );
}

function VoteCard({ record, index }: { record: VoteHistoryRecord; index: number }) {
  const levelInfo = getVoteLevelInfo(record.level);
  const LevelIcon = levelInfo.icon;

  return (
    <div
      className={cn(
        'bg-metro-card/70 border border-metro-border rounded-2xl p-5 backdrop-blur-sm',
        'hover:border-metro-blue/50 hover:bg-metro-card/90 transition-all duration-300',
        'animate-slide-up opacity-0'
      )}
      style={{ animationDelay: `${index * 80 + 100}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border"
            style={{
              background: `linear-gradient(135deg, ${record.lineColor}33 0%, ${record.lineColor}11 100%)`,
              borderColor: `${record.lineColor}55`,
            }}
          >
            <span
              className="font-display font-bold text-sm"
              style={{ color: record.lineColor }}
            >
              {record.lineName.replace('号线', '')}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{record.lineName}</h3>
              <span className="text-sm text-slate-400">·</span>
              <span className="text-sm text-slate-300 font-medium">
                {record.carriageNumber} 号车厢
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">
                {formatDateTime(record.timestamp)}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-500">
                {getRelativeTime(record.timestamp)}
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl border',
            levelInfo.bgClass
          )}
        >
          <LevelIcon className={cn('w-4 h-4', levelInfo.textClass)} />
          <span className={cn('text-sm font-semibold', levelInfo.textClass)}>
            {levelInfo.label}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-metro-border to-transparent mb-4" />

      <SnapshotBar record={record} />
    </div>
  );
}

export default function VoteHistory() {
  const {
    fetchLines,
    fetchVoteHistory,
    lines,
    voteHistory,
    voteHistoryLoading,
    historyFilterLineId,
    historyFilterTimeSlot,
    setHistoryFilterLineId,
    setHistoryFilterTimeSlot,
  } = useAppStore();

  useEffect(() => {
    if (lines.length === 0) {
      fetchLines();
    }
  }, [fetchLines, lines.length]);

  useEffect(() => {
    fetchVoteHistory();
  }, [fetchVoteHistory, historyFilterLineId, historyFilterTimeSlot]);

  const stats = useMemo(() => {
    const total = voteHistory.length;
    const cold = voteHistory.filter((v) => v.level === 'cold').length;
    const comfort = voteHistory.filter((v) => v.level === 'comfortable').length;
    const hot = voteHistory.filter((v) => v.level === 'hot').length;
    const uniqueLines = new Set(voteHistory.map((v) => v.lineId)).size;
    return { total, cold, comfort, hot, uniqueLines };
  }, [voteHistory]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metro-blue to-metro-lightBlue flex items-center justify-center shadow-lg shadow-metro-blue/30">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  投票历史回溯
                </h1>
              </div>
            </div>
            <p className="text-slate-400 text-sm ml-[52px]">
              查看你的每一次温度投票，回溯当时的车厢评分快照
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-slide-up delay-100 opacity-0">
            <div className="bg-metro-card/60 border border-metro-border rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">总投票</div>
              <div className="font-display text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-metro-card/60 border border-metro-border rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">覆盖线路</div>
              <div className="font-display text-2xl font-bold text-metro-lightBlue">
                {stats.uniqueLines}
              </div>
            </div>
            <div className="bg-metro-card/60 border border-metro-border rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">冷 / 舒适 / 热</div>
              <div className="font-display text-lg font-bold flex items-center gap-2">
                <span className="text-blue-400">{stats.cold}</span>
                <span className="text-slate-500">/</span>
                <span className="text-green-400">{stats.comfort}</span>
                <span className="text-slate-500">/</span>
                <span className="text-red-400">{stats.hot}</span>
              </div>
            </div>
            <div className="bg-metro-card/60 border border-metro-border rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">舒适率</div>
              <div className="font-display text-2xl font-bold text-green-400">
                {stats.total > 0 ? Math.round((stats.comfort / stats.total) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="bg-metro-card/50 border border-metro-border rounded-2xl p-5 mb-6 animate-slide-up delay-200 opacity-0">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-metro-lightBlue" />
              <span className="text-sm font-medium text-slate-200">筛选条件</span>
            </div>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-6">
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-2">线路名称</label>
                <select
                  value={historyFilterLineId}
                  onChange={(e) => setHistoryFilterLineId(e.target.value)}
                  className="w-full bg-metro-darker border border-metro-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-metro-blue/60 focus:ring-2 focus:ring-metro-blue/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">全部线路</option>
                  {lines.map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-2">时间段</label>
                <div className="inline-flex p-1 bg-metro-darker border border-metro-border rounded-xl w-full overflow-x-auto hide-scrollbar">
                  {HISTORY_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setHistoryFilterTimeSlot(slot)}
                      className={cn(
                        'flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                        historyFilterTimeSlot === slot
                          ? 'bg-metro-blue text-white shadow-md shadow-metro-blue/30'
                          : 'text-slate-400 hover:text-white hover:bg-metro-border/50'
                      )}
                    >
                      {getTimeSlotLabel(slot)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {voteHistoryLoading ? (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <div className="w-12 h-12 border-4 border-metro-blue/30 border-t-metro-blue rounded-full animate-spin mb-4" />
                <p className="text-slate-400 text-sm">加载投票记录中...</p>
              </div>
            ) : voteHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-metro-card/80 border border-metro-border flex items-center justify-center mb-5">
                  <Inbox className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">暂无投票记录</h3>
                <p className="text-sm text-slate-400 text-center max-w-xs">
                  {historyFilterLineId !== 'all' || historyFilterTimeSlot !== 'all'
                    ? '当前筛选条件下没有找到投票记录，试试调整筛选条件'
                    : '你还没有进行过温度投票，去首页投一票吧！'}
                </p>
              </div>
            ) : (
              voteHistory.map((record, index) => (
                <VoteCard key={record.id} record={record} index={index} />
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-600 text-xs animate-fade-in">
        数据保存在本地 · 地铁温度计
      </footer>
    </div>
  );
}
