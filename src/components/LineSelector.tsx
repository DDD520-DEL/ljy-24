import { useAppStore } from '@/store/appStore';
import { ChevronDown, Star, Train, ArrowRightLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TransferLine } from '../../shared/types.js';

function TransferBadges({ transferLines, compact = false }: { transferLines: TransferLine[]; compact?: boolean }) {
  if (!transferLines || transferLines.length === 0) return null;

  const size = compact ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const iconSize = compact ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <div className="relative group">
      <div className="flex items-center -space-x-1">
        <ArrowRightLeft className={cn(iconSize, 'text-emerald-400 mr-1')} />
        {transferLines.slice(0, compact ? 3 : 4).map((tl) => (
          <span
            key={tl.lineId}
            className={cn(size, 'rounded-full border-2 border-metro-bg shadow-sm')}
            style={{ backgroundColor: tl.lineColor }}
            title={tl.lineName}
          />
        ))}
        {transferLines.length > (compact ? 3 : 4) && (
          <span className={cn(size, 'rounded-full bg-slate-600 border-2 border-metro-bg text-[9px] font-bold text-slate-200 flex items-center justify-center')}>
            +{transferLines.length - (compact ? 3 : 4)}
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

export default function LineSelector() {
  const {
    lines,
    selectedLineId,
    setSelectedLineId,
    favorites,
    isFavorite,
    toggleFavorite,
  } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLine = lines.find((l) => l.id === selectedLineId);

  const favoriteLines = favorites
    .map((f) => lines.find((l) => l.id === f.lineId))
    .filter((l): l is NonNullable<typeof l> => l !== undefined);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {favoriteLines.length > 0 && (
        <div className="mb-4 animate-fade-in">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              常用线路
            </span>
            <span className="ml-2 text-xs text-slate-500 font-normal">
              点击快速切换
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {favoriteLines.map((line, idx) => {
              const isSelected = selectedLineId === line.id;
              return (
                <div
                  key={line.id}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={cn(
                    'animate-slide-up flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all',
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
                      className="w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: line.color }}
                    >
                      <Train className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="whitespace-nowrap">{line.name}</span>
                    <TransferBadges transferLines={line.transferLines} compact />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(line.id)}
                    title={isFavorite(line.id) ? '取消收藏' : '收藏线路'}
                    className={cn(
                      'p-1 rounded-lg transition-all',
                      'text-yellow-400 hover:bg-yellow-400/10',
                    )}
                  >
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-3 border-t border-metro-border/50" />
        </div>
      )}

      <label className="block text-sm font-medium text-slate-300 mb-2">
        选择地铁线路
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-metro-card border border-metro-border rounded-xl hover:border-metro-blue/50 transition-all group"
      >
        <div className="flex items-center gap-3">
          {selectedLine ? (
            <>
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                style={{ backgroundColor: selectedLine.color }}
              >
                <Train className="w-4 h-4" />
              </span>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{selectedLine.name}</span>
                <span className="text-slate-500 text-sm">· {selectedLine.carriageCount}节编组</span>
                <TransferBadges transferLines={selectedLine.transferLines} />
              </div>
            </>
          ) : (
            <span className="text-slate-500">请选择线路</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-metro-card border border-metro-border rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="max-h-64 overflow-y-auto">
            {lines.map((line) => {
              const fav = isFavorite(line.id);
              return (
                <div
                  key={line.id}
                  className={`flex items-center gap-2 px-2 hover:bg-metro-blue/10 transition-colors ${
                    selectedLineId === line.id ? 'bg-metro-blue/15' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLineId(line.id);
                      setOpen(false);
                    }}
                    className="flex-1 flex items-center gap-3 py-3 pr-2"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                      style={{ backgroundColor: line.color }}
                    >
                      <Train className="w-4 h-4" />
                    </span>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{line.name}</span>
                        <TransferBadges transferLines={line.transferLines} compact />
                      </div>
                      <div className="text-slate-500 text-xs">{line.carriageCount}节编组</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(line.id)}
                    title={fav ? '取消收藏' : '收藏线路'}
                    className={cn(
                      'p-2 rounded-lg transition-all flex-shrink-0',
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
      )}
    </div>
  );
}
