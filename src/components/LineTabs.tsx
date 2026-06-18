import { useAppStore } from '@/store/appStore';
import { Train } from 'lucide-react';

export default function LineTabs() {
  const { lines, selectedLineId, setSelectedLineId } = useAppStore();

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        切换线路
      </label>
      <div className="overflow-x-auto hide-scrollbar pb-1">
        <div className="flex gap-2 min-w-max">
          {lines.map((line, idx) => {
            const isSelected = selectedLineId === line.id;
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => setSelectedLineId(line.id)}
                style={{ animationDelay: `${idx * 50}ms` }}
                className={`animate-slide-up flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-metro-blue/20 text-white border border-metro-blue/50 shadow-lg shadow-metro-blue/10'
                    : 'bg-metro-card text-slate-400 border border-metro-border hover:text-white hover:border-metro-border/80'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: line.color }}
                >
                  <Train className="w-3 h-3 text-white" />
                </span>
                <span className="whitespace-nowrap">{line.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
