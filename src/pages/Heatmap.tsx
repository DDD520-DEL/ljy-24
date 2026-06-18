import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import Header from '@/components/Header';
import LineTabs from '@/components/LineTabs';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import TrainHeatmap from '@/components/TrainHeatmap';
import StatsCards from '@/components/StatsCards';
import TrendChart from '@/components/TrendChart';

export default function Heatmap() {
  const {
    fetchLines,
    fetchStats,
    fetchTrend,
    lines,
    selectedLineId,
    selectedTimeSlot,
  } = useAppStore();

  useEffect(() => {
    if (lines.length === 0) {
      fetchLines();
    }
  }, [fetchLines, lines.length]);

  useEffect(() => {
    if (selectedLineId) {
      fetchStats();
      fetchTrend();
    }
  }, [selectedLineId, selectedTimeSlot, fetchStats, fetchTrend]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              🔥 车厢温度热力图
            </h1>
            <p className="text-slate-400 text-sm">
              实时查看各线路各车厢的空调温度分布，避开冻僵和闷热车厢
            </p>
          </div>

          <div className="space-y-6">
            <div className="animate-slide-up delay-100 opacity-0">
              <LineTabs />
            </div>

            <div className="animate-slide-up delay-200 opacity-0">
              <TimeSlotPicker />
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
    </div>
  );
}
