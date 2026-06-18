import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import { CheckCircle2, BarChart3, X } from 'lucide-react';

export default function VoteSuccessModal() {
  const { voteSuccess, setVoteSuccess } = useAppStore();

  if (!voteSuccess) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-metro-card border border-metro-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-slide-up">
        <button
          onClick={() => setVoteSuccess(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-metro-border transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5 animate-bounce-soft">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-white font-display mb-2">
            投票成功！
          </h3>
          <p className="text-slate-400 mb-6">
            感谢您的反馈，数据已实时更新到热力图
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => setVoteSuccess(false)}
              className="flex-1 px-5 py-3 rounded-xl border border-metro-border text-slate-300 font-medium hover:bg-metro-border/50 transition-all"
            >
              继续投票
            </button>
            <Link
              to="/heatmap"
              onClick={() => setVoteSuccess(false)}
              className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-metro-blue to-metro-lightBlue text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-metro-blue/30 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              查看热力图
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
