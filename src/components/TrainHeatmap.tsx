import { useAppStore } from '@/store/appStore';
import { getHeatColorClass, getHeatLabel, getHeatBgColor } from '@/utils/heatmap';
import { Snowflake, Flame, Users, MessageSquare, MapPin, TrendingUp, TrendingDown, Minus, User } from 'lucide-react';
import type { TemperatureTrend } from '../../shared/types.js';

export default function TrainHeatmap() {
  const {
    currentLineStats,
    lines,
    selectedLineId,
    feedbackCountMap,
    heatmapDimension,
    openFeedbackModal,
    recordCarriageView,
  } = useAppStore();
  const line = lines.find((l) => l.id === selectedLineId);

  const renderTrendIcon = (trend: TemperatureTrend) => {
    if (trend === 'rising') {
      return (
        <div className="flex items-center gap-0.5 text-orange-300" title="预测未来1小时可能变热">
          <TrendingUp className="w-3 h-3" />
          <span className="text-[9px] font-medium">变热</span>
        </div>
      );
    }
    if (trend === 'falling') {
      return (
        <div className="flex items-center gap-0.5 text-blue-300" title="预测未来1小时可能变冷">
          <TrendingDown className="w-3 h-3" />
          <span className="text-[9px] font-medium">变冷</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-0.5 text-slate-300" title="趋势稳定">
        <Minus className="w-3 h-3" />
        <span className="text-[9px] font-medium">稳定</span>
      </div>
    );
  };

  const renderCrowdIcons = (crowdLevel: number) => {
    const maxIcons = 5;
    const activeIcons = Math.max(0, Math.min(maxIcons, crowdLevel));
    const crowdLabel = activeIcons === 0 ? '空' : activeIcons <= 2 ? '宽松' : activeIcons <= 3 ? '适中' : activeIcons <= 4 ? '拥挤' : '爆满';

    return (
      <div className="flex flex-col items-center gap-0.5" title={`拥挤度：${crowdLabel}（${activeIcons}/${maxIcons}）`}>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxIcons }).map((_, idx) => (
            <User
              key={idx}
              className={`w-2.5 h-2.5 ${idx < activeIcons ? 'text-white' : 'text-white/20'}`}
              fill={idx < activeIcons ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        <span className="text-[8px] opacity-70">{crowdLabel}</span>
      </div>
    );
  };

  if (!line || !currentLineStats) {
    return (
      <div className="bg-metro-card border border-metro-border rounded-2xl p-12 text-center">
      <div className="animate-pulse-slow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-metro-border flex items-center justify-center">
          <Users className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-500">正在加载热力图数据...</p>
      </div>
    </div>
    );
  }

  const isCarriageView = heatmapDimension === 'carriage';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: line.color }}
          />
          <h3 className="font-display font-bold text-xl text-white">
            {line.name} {isCarriageView ? '车厢' : '站点'}温度分布
          </h3>
        </div>
        <div className="text-sm text-slate-400">
          共 <span className="text-white font-semibold">{currentLineStats.totalVotes}</span> 票
        </div>
      </div>

      <div className="bg-metro-card border border-metro-border rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Snowflake className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">冷</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">热</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
        </div>

        <div className="h-2 rounded-full overflow-hidden bg-metro-border flex mb-4">
          <div className="flex-1 heat-cold" />
          <div className="flex-1 heat-cool" />
          <div className="flex-1 heat-comfort" />
          <div className="flex-1 heat-warm" />
          <div className="flex-1 heat-hot" />
        </div>

        <div className="flex items-center gap-4 mb-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-orange-400" /> 预测变热</span>
          <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-blue-400" /> 预测变冷</span>
          <span className="flex items-center gap-1"><Minus className="w-3 h-3 text-slate-400" /> 趋势稳定</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-slate-300" />
            拥挤度：
            <User className="w-3 h-3 text-white/20" />
            <span className="opacity-70">空</span>
            <User className="w-3 h-3 text-slate-300" />
            <span className="opacity-70">宽松</span>
            <User className="w-3 h-3 text-slate-300" fill="currentColor" />
            <span className="opacity-70">适中</span>
            <User className="w-3 h-3 text-white" fill="currentColor" />
            <span className="opacity-70">拥挤</span>
            <User className="w-3 h-3 text-white" fill="currentColor" />
            <User className="w-3 h-3 text-white" fill="currentColor" />
            <span className="opacity-70">爆满</span>
          </span>
        </div>

        {isCarriageView && (
          <>
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>点击车厢格子查看乘客留言</span>
            </div>

            <div className="overflow-x-auto hide-scrollbar">
              <div
                className="flex gap-2 min-w-max pb-2"
                style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out forwards' }}
              >
                {currentLineStats.carriages.map((carriage, idx) => {
                  const feedbackCount = feedbackCountMap[carriage.carriageNumber] || 0;
                  return (
                    <div
                      key={carriage.carriageNumber}
                      style={{ animationDelay: `${idx * 80}ms` }}
                      className="animate-slide-up"
                    >
                      <button
                        onClick={() => {
                          if (selectedLineId) {
                            recordCarriageView(selectedLineId, carriage.carriageNumber);
                          }
                          openFeedbackModal(carriage.carriageNumber);
                        }}
                        className={`relative w-20 sm:w-24 h-28 sm:h-32 rounded-xl ${getHeatColorClass(carriage.temperatureScore)} shadow-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-metro-blue/50`}
                      >
                        {feedbackCount > 0 && (
                          <div className="absolute -top-1 -right-1 z-20 min-w-[22px] h-5 px-1.5 rounded-full bg-gradient-to-r from-metro-blue to-metro-lightBlue text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-metro-blue/40 animate-bounce-soft">
                            {feedbackCount > 99 ? '99+' : feedbackCount}
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

                        <div className="relative z-10 h-full flex flex-col items-center justify-between p-2 text-white">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm">
                            <span className="font-bold font-display text-lg">{carriage.carriageNumber}</span>
                          </div>
                          <div className="text-center space-y-1">
                            <div>
                              <div className="text-[11px] opacity-90 font-medium">{getHeatLabel(carriage.temperatureScore)}</div>
                              <div className="text-[10px] opacity-70">{carriage.totalCount}票</div>
                            </div>
                            {renderCrowdIcons(carriage.crowdLevel)}
                            {feedbackCount > 0 && (
                              <div className="flex items-center justify-center gap-1 text-[9px] opacity-80">
                                <MessageSquare className="w-2.5 h-2.5" />
                                <span>{feedbackCount}条留言</span>
                              </div>
                            )}
                          </div>
                          {renderTrendIcon(carriage.trend)}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20 backdrop-blur-sm">
                          <div
                            className="h-full"
                            style={{
                              width: `${carriage.totalCount > 0 ? (carriage.hotCount / carriage.totalCount) * 100 : 0}%`,
                              backgroundColor: getHeatBgColor(carriage.temperatureScore),
                              opacity: 0.6,
                            }}
                          />
                        </div>

                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
                      </button>

                      <div className="mt-2 flex justify-around px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-metro-border" />
                        <div className="w-1.5 h-1.5 rounded-full bg-metro-border" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!isCarriageView && (
          <>
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>按站点区间查看温度分布差异</span>
            </div>

            <div className="overflow-x-auto hide-scrollbar">
              <div
                className="flex gap-3 min-w-max pb-2"
                style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out forwards' }}
              >
                {currentLineStats.stationSections.map((section, idx) => {
                  const sectionStations = line.stations.filter((st) => {
                    const sectionData = line.stationSections.find((s) => s.id === section.sectionId);
                    return sectionData?.stationIndices.includes(st.index);
                  });
                  const stationNames = sectionStations.map((s) => s.name).join('、');

                  return (
                    <div
                      key={section.sectionId}
                      style={{ animationDelay: `${idx * 100}ms` }}
                      className="animate-slide-up"
                    >
                      <div
                        className={`relative w-36 sm:w-44 h-32 sm:h-36 rounded-xl ${getHeatColorClass(section.temperatureScore)} shadow-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

                        <div className="relative z-10 h-full flex flex-col justify-between p-3 text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">{section.sectionName}</div>
                              <div className="text-[10px] opacity-70">{sectionStations.length}站</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium">{getHeatLabel(section.temperatureScore)}</div>
                            <div className="text-[11px] opacity-70 mt-0.5">{section.totalCount}票</div>

                            <div className="flex gap-2 mt-2 text-[10px]">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span className="opacity-80">{section.coldCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <span className="opacity-80">{section.comfortableCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                <span className="opacity-80">{section.hotCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 backdrop-blur-sm">
                          <div
                            className="h-full"
                            style={{
                              width: `${section.totalCount > 0 ? (section.hotCount / section.totalCount) * 100 : 0}%`,
                              backgroundColor: getHeatBgColor(section.temperatureScore),
                              opacity: 0.6,
                            }}
                          />
                        </div>

                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
                      </div>

                      <div className="mt-2 px-1">
                        <div className="text-[10px] text-slate-500 leading-tight line-clamp-2" title={stationNames}>
                          {stationNames}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
