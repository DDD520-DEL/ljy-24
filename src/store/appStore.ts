import { create } from 'zustand';
import type { MetroLine, VoteLevel, TimeSlot, LineStats, TrendData } from '../../shared/types.js';

interface AppState {
  lines: MetroLine[];
  selectedLineId: string | null;
  selectedCarriage: number | null;
  currentLineStats: LineStats | null;
  currentTrend: TrendData[];
  selectedTimeSlot: TimeSlot;
  voteSuccess: boolean;
  loading: boolean;
  error: string | null;

  setLines: (lines: MetroLine[]) => void;
  setSelectedLineId: (id: string | null) => void;
  setSelectedCarriage: (num: number | null) => void;
  setCurrentLineStats: (stats: LineStats | null) => void;
  setCurrentTrend: (trend: TrendData[]) => void;
  setSelectedTimeSlot: (slot: TimeSlot) => void;
  setVoteSuccess: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
  submitVote: (level: VoteLevel) => Promise<boolean>;
  fetchLines: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchTrend: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  lines: [],
  selectedLineId: null,
  selectedCarriage: null,
  currentLineStats: null,
  currentTrend: [],
  selectedTimeSlot: 'all',
  voteSuccess: false,
  loading: false,
  error: null,

  setLines: (lines) => set({ lines }),
  setSelectedLineId: (id) => {
    set({ selectedLineId: id, selectedCarriage: null, currentLineStats: null });
  },
  setSelectedCarriage: (num) => set({ selectedCarriage: num }),
  setCurrentLineStats: (stats) => set({ currentLineStats: stats }),
  setCurrentTrend: (trend) => set({ currentTrend: trend }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setVoteSuccess: (val) => set({ voteSuccess: val }),
  setLoading: (val) => set({ loading: val }),
  setError: (err) => set({ error: err }),

  submitVote: async (level) => {
    const { selectedLineId, selectedCarriage } = get();
    if (!selectedLineId || !selectedCarriage) {
      set({ error: '请先选择线路和车厢' });
      return false;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineId: selectedLineId,
          carriageNumber: selectedCarriage,
          level,
        }),
      });
      const data = await res.json();
      if (data.success) {
        set({ voteSuccess: true, loading: false });
        return true;
      } else {
        set({ error: data.error || '提交失败', loading: false });
        return false;
      }
    } catch {
      set({ error: '网络错误', loading: false });
      return false;
    }
  },

  fetchLines: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/lines');
      const data = await res.json();
      if (data.success) {
        set({ lines: data.data, loading: false });
        if (data.data.length > 0 && !get().selectedLineId) {
          set({ selectedLineId: data.data[0].id });
        }
      } else {
        set({ error: data.error || '获取线路失败', loading: false });
      }
    } catch {
      set({ error: '网络错误', loading: false });
    }
  },

  fetchStats: async () => {
    const { selectedLineId, selectedTimeSlot } = get();
    if (!selectedLineId) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/stats/${selectedLineId}?timeSlot=${selectedTimeSlot}`);
      const data = await res.json();
      if (data.success) {
        set({ currentLineStats: data.data, loading: false });
      } else {
        set({ error: data.error || '获取统计失败', loading: false });
      }
    } catch {
      set({ error: '网络错误', loading: false });
    }
  },

  fetchTrend: async () => {
    const { selectedLineId } = get();
    if (!selectedLineId) return;

    try {
      const res = await fetch(`/api/stats/${selectedLineId}/trend`);
      const data = await res.json();
      if (data.success) {
        set({ currentTrend: data.data });
      }
    } catch {
      // silent fail for trend
    }
  },
}));
