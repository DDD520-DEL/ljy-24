import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import Header from '@/components/Header';
import LineTabs from '@/components/LineTabs';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import StationDimensionToggle from '@/components/StationDimensionToggle';
import TrainHeatmap from '@/components/TrainHeatmap';
import StatsCards from '@/components/StatsCards';
import TrendChart from '@/components/TrendChart';
import FeedbackListModal from '@/components/FeedbackListModal';

export default function Heatmap() {
  const {
    fetchLines,
    fetchStats,
    fetchTrend,
    fetchFavorites,
    fetchFeedbackCounts,
    lines,
    selectedLineId,
    selectedTimeSlot,
    heatmapDimension,
  } = useAppStore();

  useEffect(() => {
    if (lines.length === 0) {
      fetchLines();
    }
    fetchFavorites();
  }, [fetchLines, fetchFavorites, lines.length]);

  useEffect(() => {
    if (selectedLineId) {
      fetchStats();
      fetchTrend();
      fetchFeedbackCounts();
    }
  }, [selectedLineId, selectedTimeSlot, heatmapDimension, fetchStats, fetchTrend, fetchFeedbackCounts]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              🔥 温度热力图
            </h1>
            <p className="text-slate-400 text-sm">
              实时查看各线路不同车厢和站点的空调温度分布，避开冻僵和闷热区域
            </p>
          </div>

          <div className="space-y-6">
            <div className="animate-slide-up delay-100 opacity-0">
              <LineTabs />
            </div>

            <div className="animate-slide-up delay-200 opacity-0 flex flex-wrap gap-6 items-start">
              <TimeSlotPicker />
              <StationDimensionToggle />
            </div>

            <div className="animate-slide-up delay-300 opacity-0">
              <StatsCards />
            </div>

            <div className="animate-slide-up delay-400 opacity-0">
              <TrainHeatmap />
            </div>

            <div className="animate-slide-up delay-500 opacity-0">
              <TrendChart />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-600 text-xs animate-fade-in">
        数据实时更新 · 地铁温度计
      </footer>

      <FeedbackListModal />
    </div>
  );
}
