import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import type { VoteLevel } from '../../../shared/types';

interface VoteButtonProps {
  level: VoteLevel;
  emoji: string;
  label: string;
  subLabel: string;
  gradient: string;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  color: string;
}

function VoteButton({ level, emoji, label, subLabel, gradient }: VoteButtonProps) {
  const { submitVote, selectedLineId, selectedCarriage } = useAppStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const disabled = !selectedLineId || !selectedCarriage || isSubmitting;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    const colors = gradient.includes('blue')
      ? ['#3B82F6', '#38BDF8', '#93C5FD']
      : gradient.includes('green')
      ? ['#10B981', '#34D399', '#6EE7B7']
      : ['#EF4444', '#F97316', '#FBBF24'];

    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 40 + Math.random() * 40;
      return {
        id: Date.now() + i,
        tx: Math.cos(angle) * distance + (centerX - rect.width / 2),
        ty: Math.sin(angle) * distance + (centerY - rect.height / 2),
        color: colors[i % colors.length],
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 800);

    setIsSubmitting(true);
    await submitVote(level);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden group w-full h-40 sm:h-44 rounded-2xl transition-all duration-300 transform ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:scale-105 hover:-translate-y-1 active:scale-100 cursor-pointer'
      } ${gradient} shadow-xl`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: `calc(50% + ${p.tx}px)`,
            top: `calc(50% + ${p.ty}px)`,
            backgroundColor: p.color,
            animation: 'particle 0.8s ease-out forwards',
            opacity: 0,
          }}
        />
      ))}
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-1 p-4">
        <span className="text-5xl sm:text-6xl transition-transform duration-300 group-hover:scale-110">
          {emoji}
        </span>
        <span className="text-white font-bold text-xl font-display tracking-wide">
          {label}
        </span>
        <span className="text-white/70 text-xs">{subLabel}</span>
      </div>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
    </button>
  );
}

export default function VoteButtons() {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-3">
        当前体感如何？
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VoteButton
          level="cold"
          emoji="🥶"
          label="冻僵"
          subLabel="太冷了要加衣"
          gradient="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400"
        />
        <VoteButton
          level="comfortable"
          emoji="😌"
          label="刚好"
          subLabel="温度刚刚好"
          gradient="bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400"
        />
        <VoteButton
          level="hot"
          emoji="🥵"
          label="闷热"
          subLabel="要中暑了救命"
          gradient="bg-gradient-to-br from-red-600 via-orange-500 to-amber-400"
        />
      </div>
    </div>
  );
}
