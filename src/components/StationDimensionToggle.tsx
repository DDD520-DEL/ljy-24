import { useAppStore } from '@/store/appStore';
import { Train, MapPin } from 'lucide-react';
import type { HeatmapDimension } from 'shared/types.js';
import { cn } from '@/lib/utils';

export default function StationDimensionToggle() {
  const { heatmapDimension, setHeatmapDimension } = useAppStore();

  const options: { value: HeatmapDimension; label: string; icon: typeof Train }[] = [
    { value: 'carriage', label: '按车厢', icon: Train },
    { value: 'station', label: '按站点', icon: MapPin },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        查看维度
      </label>
      <div className="inline-flex p-1 bg-metro-card border border-metro-border rounded-xl">
        {options.map((option) => {
          const isActive = heatmapDimension === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setHeatmapDimension(option.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-metro-blue text-white shadow-lg shadow-metro-blue/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {heatmapDimension === 'carriage'
          ? '查看不同车厢的温度分布差异'
          : '查看不同站点区间的温度分布差异'}
      </p>
    </div>
  );
}
