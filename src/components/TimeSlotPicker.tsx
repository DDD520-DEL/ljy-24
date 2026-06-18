import { useAppStore } from '@/store/appStore';
import type { TimeSlot } from '../../../shared/types';
import { getTimeSlotLabel } from '@/utils/heatmap';

const SLOTS: TimeSlot[] = ['all', 'morning', 'evening', 'offpeak'];

export default function TimeSlotPicker() {
  const { selectedTimeSlot, setSelectedTimeSlot } = useAppStore();

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        选择时段
      </label>
      <div className="inline-flex p-1 bg-metro-card border border-metro-border rounded-xl">
        {SLOTS.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => setSelectedTimeSlot(slot)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeSlot === slot
                ? 'bg-metro-blue text-white shadow-md shadow-metro-blue/30'
                : 'text-slate-400 hover:text-white hover:bg-metro-border/50'
            }`}
          >
            {getTimeSlotLabel(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}
