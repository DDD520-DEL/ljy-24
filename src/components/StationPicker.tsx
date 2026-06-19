import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StationPicker() {
  const { lines, selectedLineId, selectedStationSectionId, setSelectedStationSectionId } = useAppStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    setExpandedSection(null);
  }, [selectedLineId]);

  const line = lines.find((l) => l.id === selectedLineId);
  const sections = line?.stationSections || [];
  const stations = line?.stations || [];

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

  if (sections.length === 0) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          选择所在站点区间
        </label>
        <div className="bg-metro-card/50 border border-dashed border-metro-border rounded-xl p-8 text-center text-slate-500 text-sm">
          暂无站点数据
        </div>
      </div>
    );
  }

  const getSectionStations = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return [];
    return stations.filter((st) => section.stationIndices.includes(st.index));
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
          const sectionStations = getSectionStations(section.id);
          const stationNames = sectionStations.map((s) => s.name).join('、');

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
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedStationSectionId(isSelected ? null : section.id)}
                    className="flex-1 flex items-center gap-3 px-4 py-3 text-left"
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0',
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
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          'font-medium transition-colors truncate',
                          isSelected ? 'text-white' : 'text-slate-300',
                        )}
                      >
                        {section.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {sectionStations.length} 个站点
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="p-3 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
                    aria-label={isExpanded ? '收起站点列表' : '展开站点列表'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 border-t border-metro-border/50 animate-fade-in">
                    <div className="text-xs text-slate-500 leading-relaxed">
                      {stationNames || '暂无站点信息'}
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
          已选择{' '}
          <span className="font-bold">
            {sections.find((s) => s.id === selectedStationSectionId)?.name || ''}
          </span>
        </p>
      )}
    </div>
  );
}
