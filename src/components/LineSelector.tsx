import { useAppStore } from '@/store/appStore';
import { ChevronDown, Train } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LineSelector() {
  const { lines, selectedLineId, setSelectedLineId } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLine = lines.find((l) => l.id === selectedLineId);

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
              <span className="text-white font-medium">{selectedLine.name}</span>
              <span className="text-slate-500 text-sm">· {selectedLine.carriageCount}节编组</span>
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
            {lines.map((line) => (
              <button
                key={line.id}
                type="button"
                onClick={() => {
                  setSelectedLineId(line.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-metro-blue/10 transition-colors ${
                  selectedLineId === line.id ? 'bg-metro-blue/15' : ''
                }`}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                  style={{ backgroundColor: line.color }}
                >
                  <Train className="w-4 h-4" />
                </span>
                <div className="text-left flex-1">
                  <div className="text-white font-medium">{line.name}</div>
                  <div className="text-slate-500 text-xs">{line.carriageCount}节编组</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
