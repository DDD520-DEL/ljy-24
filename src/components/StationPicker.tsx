import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StationPicker() {
  const { lines, selectedLineId, selectedStationSectionId, setSelectedStationSectionId } = useAppStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const line = lines.find((l) => l.id === selectedLineId);

  if (!selectedLineId || !line) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          选择所在站点区间
        </label>
        <div className="bg-metro-card/50 border border-dashed border-metro-border rounded-xl p-8 text-center text-slate-500 text-sm">
          请先选择线路
        </div>
      </div>
    );
  }

  const sections = line.stationSections;

  const getSectionStations = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return [];
    return line.stations.filter((st) => section.stationIndices.includes(st.index));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-3">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-metro-lightBlue" />
          选择所在站点区间
        </span>
        <span className="ml-2 text-xs text-slate-500 font-normal">
          选填，帮助我们统计不同站点的温度差异
        </span>
      </label>

      <div className="space-y-2">
        {sections.map((section, idx) => {
          const isSelected = selectedStationSectionId === section.id;
          const isExpanded = expandedSection === section.id;
          const stations = getSectionStations(section.id);
          const stationNames = stations.map((s) => s.name).join('、');

          return (
            <div
              key={section.id}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="animate-slide-up"
            >
              <div
                className={cn(
                  'relative overflow-hidden rounded-xl transition-all duration-300',
                  isSelected
                    ? 'bg-metro-blue/15 border border-metro-blue/50 shadow-lg shadow-metro-blue/10'
                    : 'bg-metro-card border border-metro-border hover:border-metro-blue/30',
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedStationSectionId(isSelected ? null : section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isSelected ? 'bg-metro-blue/30' : 'bg-metro-border/50',
                      )}
                    >
                      <MapPin
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isSelected ? 'text-metro-lightBlue' : 'text-slate-500',
                        )}
                      />
                    </div>
                    <div>
                      <div
                        className={cn(
                          'font-medium transition-colors',
                          isSelected ? 'text-white' : 'text-slate-300',
                        )}
                      >
                        {section.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {stations.length} 个站点
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedSection(isExpanded ? null : section.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 border-t border-metro-border/50 animate-fade-in">
                    <div className="text-xs text-slate-500 leading-relaxed">
                      {stationNames}
                    </div>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-metro-green rounded-full animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedStationSectionId && (
        <p className="mt-3 text-sm text-metro-lightBlue animate-fade-in">
          已选择 <span className="font-bold">{sections.find((s) => s.id === selectedStationSectionId)?.name}</span>
        </p>
      )}
    </div>
  );
}
