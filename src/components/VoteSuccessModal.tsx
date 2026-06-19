import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import { CheckCircle2, BarChart3, X, MessageSquare, Send } from 'lucide-react';
import type { VoteLevel } from 'shared/types.js';

const LEVEL_META: Record<VoteLevel, { emoji: string; label: string; gradient: string }> = {
  cold: {
    emoji: '🥶',
    label: '冷',
    gradient: 'from-blue-500 to-cyan-400',
  },
  comfortable: {
    emoji: '😌',
    label: '舒适',
    gradient: 'from-emerald-500 to-green-400',
  },
  hot: {
    emoji: '🥵',
    label: '热',
    gradient: 'from-orange-500 to-amber-400',
  },
};

export default function VoteSuccessModal() {
  const { voteSuccess, setVoteSuccess, lastVoteLevel, submitFeedback } = useAppStore();
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const MAX_LENGTH = 50;

  if (!voteSuccess) return null;

  const levelMeta = lastVoteLevel ? LEVEL_META[lastVoteLevel] : null;

  const handleClose = () => {
    setVoteSuccess(false);
    setFeedback('');
    setFeedbackSubmitted(false);
    setIsSubmittingFeedback(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || isSubmittingFeedback) return;

    setIsSubmittingFeedback(true);
    const success = await submitFeedback(feedback.trim());
    setIsSubmittingFeedback(false);

    if (success) {
      setFeedbackSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-metro-card border border-metro-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
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

          {levelMeta && (
            <div className={`w-full mb-6 p-4 rounded-xl bg-gradient-to-r ${levelMeta.gradient} bg-opacity-10 border border-white/10`}>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{levelMeta.emoji}</span>
                <div className="text-left">
                  <div className="text-white font-bold">您的体感：{levelMeta.label}</div>
                  <div className="text-white/70 text-sm">欢迎分享更多细节</div>
                </div>
              </div>
            </div>
          )}

          {!feedbackSubmitted ? (
            <div className="w-full mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3 text-left">
                <MessageSquare className="w-4 h-4 text-metro-lightBlue" />
                附带留言（可选，限50字）
              </label>
              <div className="relative">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value.slice(0, MAX_LENGTH))}
                  placeholder="比如：风太大吹得头疼、人太多有点闷..."
                  className="w-full h-24 px-4 py-3 rounded-xl bg-metro-bg border border-metro-border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-metro-blue/50 focus:border-metro-blue resize-none transition-all"
                  disabled={isSubmittingFeedback}
                />
                <div className="absolute bottom-2 right-3 text-xs text-slate-500">
                  {feedback.length}/{MAX_LENGTH}
                </div>
              </div>
              {feedback.trim().length > 0 && (
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                  className="mt-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-metro-blue to-metro-lightBlue text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-metro-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingFeedback ? '提交中...' : '提交留言'}
                </button>
              )}
            </div>
          ) : (
            <div className="w-full mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">留言已提交，感谢分享！</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleClose}
              className="flex-1 px-5 py-3 rounded-xl border border-metro-border text-slate-300 font-medium hover:bg-metro-border/50 transition-all"
            >
              继续投票
            </button>
            <Link
              to="/heatmap"
              onClick={handleClose}
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
