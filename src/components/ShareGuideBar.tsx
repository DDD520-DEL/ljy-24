import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Share2, Copy, Check, X, Thermometer } from 'lucide-react';
import type { VoteLevel } from 'shared/types.js';

const LEVEL_TEXT: Record<VoteLevel, { emoji: string; desc: string; tag: string }> = {
  cold: {
    emoji: '🥶',
    desc: '太冷了，冻得瑟瑟发抖',
    tag: '避寒指南',
  },
  comfortable: {
    emoji: '😌',
    desc: '温度刚刚好，坐着很舒服',
    tag: '舒适车厢',
  },
  hot: {
    emoji: '🥵',
    desc: '太热了，闷得浑身冒汗',
    tag: '降温提醒',
  },
};

export default function ShareGuideBar() {
  const {
    shareGuideVisible,
    setShareGuideVisible,
    selectedLineId,
    selectedCarriage,
    lastVoteLevel,
    lines,
  } = useAppStore();

  const [copied, setCopied] = useState(false);

  if (!shareGuideVisible) return null;
  if (!selectedLineId || selectedCarriage == null || !lastVoteLevel) return null;

  const selectedLine = lines.find((l) => l.id === selectedLineId);
  const lineName = selectedLine?.name || '地铁';
  const levelInfo = LEVEL_TEXT[lastVoteLevel];

  const shareText = `【${levelInfo.tag}】我刚刚在${lineName}${selectedCarriage}号车厢投票：${levelInfo.emoji}${levelInfo.desc}！来「地铁温度吐槽站」看看哪节车厢最舒适，避开冻僵/闷热车厢 →`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
      document.body.removeChild(textarea);
    }
  };

  const handleClose = () => {
    setShareGuideVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 animate-slide-up">
      <div className="max-w-2xl mx-auto bg-metro-card border border-metro-lightBlue/30 rounded-2xl shadow-2xl shadow-metro-blue/20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-metro-blue via-metro-lightBlue to-violet-500" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-metro-blue to-metro-lightBlue flex items-center justify-center shadow-lg shadow-metro-blue/30">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-white">分享给朋友</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-metro-lightBlue/15 text-metro-lightBlue">
                    一键复制
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-metro-border transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                <Thermometer className="w-3.5 h-3.5" />
                <span>{lineName} · {selectedCarriage}号车厢</span>
                {levelInfo && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span>{levelInfo.emoji} {levelInfo.tag}</span>
                  </>
                )}
              </div>
              <div className="p-3 rounded-xl bg-metro-bg border border-metro-border text-sm text-slate-300 leading-relaxed mb-3 select-all">
                {shareText}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    copied
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-gradient-to-r from-metro-blue to-metro-lightBlue text-white hover:shadow-lg hover:shadow-metro-blue/30'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      已复制，去粘贴给朋友吧！
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      复制分享文案
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-metro-border text-slate-400 font-medium hover:bg-metro-border/50 hover:text-white transition-all text-sm"
                >
                  稍后再说
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
