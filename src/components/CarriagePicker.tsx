import { useAppStore } from '@/store/appStore';

export default function CarriagePicker() {
  const { lines, selectedLineId, selectedCarriage, setSelectedCarriage } = useAppStore();
  const line = lines.find((l) => l.id === selectedLineId);
  const carriageCount = line?.carriageCount || 6;

  if (!selectedLineId) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          选择所在车厢
        </label>
        <div className="bg-metro-card/50 border border-dashed border-metro-border rounded-xl p-8 text-center text-slate-500 text-sm">
          请先选择线路
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-3">
        选择所在车厢
      </label>
      <div className="relative">
        <div className="overflow-x-auto hide-scrollbar pb-2">
          <div
            className="flex gap-2 min-w-max px-1"
            style={{ opacity: 0, animation: 'fadeIn 0.4s ease-out forwards' }}
          >
            {Array.from({ length: carriageCount }, (_, i) => i + 1).map((num, idx) => {
              const isSelected = selectedCarriage === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedCarriage(num)}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className={`relative flex flex-col items-center justify-center min-w-[72px] h-20 rounded-xl transition-all duration-300 animate-slide-up ${
                    isSelected
                      ? 'bg-metro-blue text-white shadow-lg shadow-metro-blue/40 scale-110 z-10'
                      : 'bg-metro-card text-slate-300 border border-metro-border hover:border-metro-blue/50 hover:text-white'
                  }`}
                >
                  <span className={`text-2xl font-bold font-display ${isSelected ? '' : 'text-slate-400'}`}>
                    {num}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider mt-0.5 opacity-80">
                    Car
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-metro-green rounded-full flex items-center justify-center text-[10px] shadow-md animate-bounce-soft">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-12 bg-gradient-to-r from-metro-dark to-transparent pointer-events-none" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-12 bg-gradient-to-l from-metro-dark to-transparent pointer-events-none" />
      </div>
      {selectedCarriage && (
        <p className="mt-3 text-sm text-metro-lightBlue animate-fade-in">
          已选择 <span className="font-bold">{selectedCarriage}</span> 号车厢
        </p>
      )}
    </div>
  );
}
