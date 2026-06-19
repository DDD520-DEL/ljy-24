import { useAppStore } from '@/store/appStore';
import { Star, Train, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TransferLine } from '../../shared/types.js';

function TransferBadges({ transferLines }: { transferLines: TransferLine[] }) {
  if (!transferLines || transferLines.length === 0) return null;

  return (
    <div className="relative group">
      <div className="flex items-center -space-x-1">
        <ArrowRightLeft className="w-3 h-3 text-emerald-400 mr-1" />
        {transferLines.slice(0, 4).map((tl) => (
          <span
            key={tl.lineId}
            className="w-4 h-4 rounded-full border-2 border-metro-bg shadow-sm"
            style={{ backgroundColor: tl.lineColor }}
            title={tl.lineName}
          />
        ))}
        {transferLines.length > 4 && (
          <span className="w-4 h-4 rounded-full bg-slate-600 border-2 border-metro-bg text-[9px] font-bold text-slate-200 flex items-center justify-center">
            +{transferLines.length - 4}
          </span>
        )}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
        <div className="bg-metro-card border border-metro-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap animate-fade-in">
          <div className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
            可换乘线路
          </div>
          <div className="space-y-1">
            {transferLines.map((tl) => (
              <div key={tl.lineId} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tl.lineColor }}
                />
                <span className="text-slate-200">{tl.lineName}</span>
                <span className="text-slate-500">
                  ({tl.stations.join('、')})
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2 h-2 bg-metro-card border-b border-r border-metro-border rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}

export default function LineTabs() {
  const {
    lines,
    selectedLineId,
    setSelectedLineId,
    toggleFavorite,
    isFavorite,
  } = useAppStore();

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        切换线路
        <span className="ml-2 text-xs text-slate-500 font-normal">
          点击 ☆ 可收藏常用线路 · <span className="inline-flex items-center gap-1"><ArrowRightLeft className="w-3 h-3 text-emerald-400" /> 表示可换乘</span>
        </span>
      </label>
      <div className="overflow-x-auto hide-scrollbar pb-1">
        <div className="flex gap-2 min-w-max">
          {lines.map((line, idx) => {
            const isSelected = selectedLineId === line.id;
            const fav = isFavorite(line.id);
            return (
              <div
                key={line.id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className={cn(
                  'animate-slide-up flex items-center gap-1 px-2 py-1 rounded-xl transition-all',
                  isSelected
                    ? 'bg-metro-blue/20 border border-metro-blue/50 shadow-lg shadow-metro-blue/10'
                    : 'bg-metro-card border border-metro-border hover:border-metro-border/80',
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedLineId(line.id)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all',
                    isSelected ? 'text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: line.color }}
                  >
                    <Train className="w-3 h-3 text-white" />
                  </span>
                  <span className="whitespace-nowrap">{line.name}</span>
                  <TransferBadges transferLines={line.transferLines} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(line.id)}
                  title={fav ? '取消收藏' : '收藏线路'}
                  className={cn(
                    'p-1 rounded-lg transition-all',
                    fav
                      ? 'text-yellow-400 hover:bg-yellow-400/10'
                      : 'text-slate-600 hover:text-yellow-400 hover:bg-yellow-400/5',
                  )}
                >
                  <Star
                    className={cn(
                      'w-4 h-4 transition-all',
                      fav ? 'fill-yellow-400' : '',
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
