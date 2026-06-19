import { useAppStore } from '@/store/appStore';
import { Train, Clock, Sunrise, Sunset, CalendarDays } from 'lucide-react';

export default function LineTimetable() {
  const { lines, selectedLineId } = useAppStore();

  const currentLine = lines.find((line) => line.id === selectedLineId);

  if (!currentLine) return null;

  const { timetable } = currentLine;
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  const displayFirstTrain = isWeekend && timetable.firstTrainWeekend
    ? timetable.firstTrainWeekend
    : timetable.firstTrain;
  const displayLastTrain = isWeekend && timetable.lastTrainWeekend
    ? timetable.lastTrainWeekend
    : timetable.lastTrain;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-medium text-slate-400">运营时刻</h2>
        <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          {isWeekend ? '今日周末' : '今日工作日'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div
          className="relative overflow-hidden bg-metro-card border border-metro-border rounded-xl p-4 group hover:border-metro-blue/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-400 opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-lg bg-metro-border/50 flex items-center justify-center mb-3 text-amber-400">
              <Sunrise className="w-5 h-5" />
            </div>
            <div className="text-sm text-slate-400 mb-1">首班车</div>
            <div className="text-2xl font-bold font-display bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
              {displayFirstTrain}
            </div>
            {timetable.firstTrainWeekend && (
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                周末: {timetable.firstTrainWeekend}
              </div>
            )}
          </div>
        </div>

        <div
          className="relative overflow-hidden bg-metro-card border border-metro-border rounded-xl p-4 group hover:border-metro-blue/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-400 opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-lg bg-metro-border/50 flex items-center justify-center mb-3 text-indigo-400">
              <Sunset className="w-5 h-5" />
            </div>
            <div className="text-sm text-slate-400 mb-1">末班车</div>
            <div className="text-2xl font-bold font-display bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent">
              {displayLastTrain}
            </div>
            {timetable.lastTrainWeekend && (
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                周末: {timetable.lastTrainWeekend}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-metro-border/30 rounded-lg text-xs text-slate-400">
        <Train className="w-3.5 h-3.5 text-metro-lightBlue" />
        <span>
          {currentLine.name} 共 {currentLine.carriageCount} 节车厢 · {currentLine.stations.length} 个站点
        </span>
      </div>
    </div>
  );
}
