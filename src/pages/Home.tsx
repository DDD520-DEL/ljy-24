import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import Header from '@/components/Header';
import LineSelector from '@/components/LineSelector';
import CarriagePicker from '@/components/CarriagePicker';
import StationPicker from '@/components/StationPicker';
import VoteButtons from '@/components/VoteButtons';
import VoteSuccessModal from '@/components/VoteSuccessModal';
import { Link } from 'react-router-dom';
import { BarChart3, Info } from 'lucide-react';

export default function Home() {
  const { fetchLines, fetchFavorites, lines, error, selectedLineId, selectedCarriage } = useAppStore();

  useEffect(() => {
    if (lines.length === 0) {
      fetchLines();
    }
    fetchFavorites();
  }, [fetchLines, fetchFavorites, lines.length]);

  return (
    <div className="min-h-screen">
      <Header />
      <VoteSuccessModal />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              🚇 地铁温度吐槽站
            </h1>
            <p className="text-slate-400">
              投票你所在车厢的体感温度，让更多人避开冻僵/闷热车厢
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="animate-slide-up delay-100 opacity-0">
              <LineSelector />
            </div>

            <div className="animate-slide-up delay-200 opacity-0">
              <CarriagePicker />
            </div>

            <div className="animate-slide-up delay-300 opacity-0">
              <StationPicker />
            </div>

            <div className="animate-slide-up delay-400 opacity-0">
              <VoteButtons />
            </div>

            {!selectedLineId || !selectedCarriage ? (
              <div className="animate-slide-up delay-500 opacity-0 flex items-start gap-3 p-4 bg-metro-card/50 border border-metro-border rounded-xl">
                <Info className="w-5 h-5 text-metro-lightBlue flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400">
                  请先选择你当前乘坐的地铁线路和车厢编号，然后点击最符合你体感的按钮进行投票。
                  站点区间为选填项，填写后可以帮助我们统计不同站点的温度差异。
                  所有数据匿名提交，感谢你为通勤族做的贡献！
                </p>
              </div>
            ) : null}

            <div className="animate-slide-up delay-500 opacity-0 pt-4 text-center">
              <Link
                to="/heatmap"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-metro-lightBlue hover:text-white hover:bg-metro-blue/10 rounded-xl transition-all text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                查看实时热力图 →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-600 text-xs animate-fade-in">
        让通勤更舒适 · 地铁温度计
      </footer>
    </div>
  );
}
