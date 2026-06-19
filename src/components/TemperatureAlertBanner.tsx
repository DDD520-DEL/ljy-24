import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { AlertTriangle, X, Clock, MapPin, ThermometerSnowflake, Flame, AlertCircle } from 'lucide-react';
import type { TemperatureAnomaly, AnomalyType } from 'shared/types.js';

function formatTimeWindow(start: number, end: number): string {
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };
  return `${formatTime(start)} - ${formatTime(end)}`;
}

function getAnomalyIcon(type: AnomalyType) {
  switch (type) {
    case 'sudden_cold':
      return <ThermometerSnowflake className="w-6 h-6" />;
    case 'sudden_hot':
      return <Flame className="w-6 h-6" />;
    default:
      return <AlertCircle className="w-6 h-6" />;
  }
}

function getAnomalyTypeLabel(type: AnomalyType): string {
  switch (type) {
    case 'sudden_cold':
      return '温度骤降';
    case 'sudden_hot':
      return '温度骤升';
    case 'volatile':
      return '温度波动异常';
  }
}

interface AnomalyBannerProps {
  anomaly: TemperatureAnomaly;
  onDismiss: () => void;
}

function AnomalyBanner({ anomaly, onDismiss }: AnomalyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const bgClass = anomaly.severity === 'danger'
    ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500'
    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500';

  const borderClass = anomaly.severity === 'danger'
    ? 'border-red-400/30'
    : 'border-amber-400/30';

  if (!isVisible) return null;

  return (
    <div
      className={`relative overflow-hidden ${bgClass} border-b ${borderClass} shadow-lg transition-all duration-300 animate-slide-down`}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />

      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
            <div className="text-white animate-pulse">
              {getAnomalyIcon(anomaly.type)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-white/90" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                {getAnomalyTypeLabel(anomaly.type)} · 空调故障预警
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                anomaly.severity === 'danger'
                  ? 'bg-red-900/50 text-red-100'
                  : 'bg-amber-900/50 text-amber-100'
              }`}>
                {anomaly.severity === 'danger' ? '高危' : '注意'}
              </span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white">
                置信度 {anomaly.confidenceScore}%
              </span>
            </div>

            <p className="text-white/95 text-sm font-medium mb-2">
              {anomaly.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  <strong className="text-white font-semibold">{anomaly.lineName}</strong>
                  {' · '}
                  <strong className="text-white font-semibold">{anomaly.carriageNumber}号车厢</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  建议避开时段：
                  <strong className="text-white font-semibold">
                    {formatTimeWindow(anomaly.suggestedAvoidStart, anomaly.suggestedAvoidEnd)}
                  </strong>
                </span>
              </div>
              <div className="text-white/60">
                近30分钟投票：{anomaly.recentVoteCount}票 · 历史投票：{anomaly.historicalVoteCount}票
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="关闭提醒"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TemperatureAlertBanner() {
  const { anomalies, dismissedAnomalyIds, fetchAnomalies, dismissAnomaly } = useAppStore();

  useEffect(() => {
    fetchAnomalies();
    const interval = setInterval(fetchAnomalies, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnomalies]);

  const activeAnomalies = anomalies.filter(a => !dismissedAnomalyIds.has(a.id));

  if (activeAnomalies.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {activeAnomalies.map((anomaly) => (
        <AnomalyBanner
          key={anomaly.id}
          anomaly={anomaly}
          onDismiss={() => dismissAnomaly(anomaly.id)}
        />
      ))}
    </div>
  );
}
