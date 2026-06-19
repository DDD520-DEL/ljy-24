import { useAppStore } from '@/store/appStore';
import { Star, Train } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          点击 ☆ 可收藏常用线路
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
