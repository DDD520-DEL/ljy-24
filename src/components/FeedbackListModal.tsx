import { useAppStore } from '@/store/appStore';
import { X, MessageSquare, Clock, Snowflake, Smile, Flame, Loader2 } from 'lucide-react';
import type { Feedback, VoteLevel } from '../../shared/types.js';

const LEVEL_STYLES: Record<VoteLevel, { icon: React.ReactNode; label: string; bgClass: string; textClass: string; borderClass: string }> = {
  cold: {
    icon: <Snowflake className="w-3.5 h-3.5" />,
    label: '冷',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
  },
  comfortable: {
    icon: <Smile className="w-3.5 h-3.5" />,
    label: '舒适',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  hot: {
    icon: <Flame className="w-3.5 h-3.5" />,
    label: '热',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500/30',
  },
};

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function FeedbackItem({ feedback }: { feedback: Feedback }) {
  const style = LEVEL_STYLES[feedback.level];

  return (
    <div className={`p-4 rounded-xl bg-metro-bg border border-metro-border hover:border-metro-blue/30 transition-all`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bgClass} ${style.textClass} ${style.borderClass}`}>
          {style.icon}
          <span>{style.label}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
          <Clock className="w-3 h-3" />
          <span>{formatTime(feedback.timestamp)}</span>
        </div>
      </div>
      <p className="text-slate-200 text-sm leading-relaxed">
        {feedback.content}
      </p>
    </div>
  );
}

export default function FeedbackListModal() {
  const {
    feedbackModalOpen,
    closeFeedbackModal,
    selectedFeedbackCarriage,
    feedbackList,
    feedbackListLoading,
    feedbackListTotal,
    lines,
    selectedLineId,
  } = useAppStore();

  if (!feedbackModalOpen) return null;

  const line = lines.find((l) => l.id === selectedLineId);
  const lineName = line?.name || selectedLineId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-metro-card border border-metro-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-metro-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metro-blue to-metro-lightBlue flex items-center justify-center shadow-lg shadow-metro-blue/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white font-display text-lg">
                {lineName} · {selectedFeedbackCarriage}号车厢
              </h3>
              <p className="text-sm text-slate-400">
                乘客留言反馈
                {feedbackListTotal > 0 && (
                  <span className="text-metro-lightBlue ml-1">（共 {feedbackListTotal} 条）</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={closeFeedbackModal}
            className="p-2 rounded-lg hover:bg-metro-border transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {feedbackListLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-metro-lightBlue animate-spin mb-3" />
              <p className="text-slate-400 text-sm">加载留言中...</p>
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-metro-border flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-300 font-medium mb-1">暂无留言</p>
              <p className="text-slate-500 text-sm">这节车厢还没有乘客留言</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.map((feedback) => (
                <FeedbackItem key={feedback.id} feedback={feedback} />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-metro-border shrink-0">
          <button
            onClick={closeFeedbackModal}
            className="w-full px-5 py-3 rounded-xl border border-metro-border text-slate-300 font-medium hover:bg-metro-border/50 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
