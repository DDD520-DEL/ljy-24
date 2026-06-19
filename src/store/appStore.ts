import { create } from 'zustand';
import type { MetroLine, VoteLevel, TimeSlot, LineStats, TrendData, FavoriteLine, TemperatureAnomaly, VoteHistoryRecord } from '../../shared/types.js';

function getOrCreateUserId(): string {
  let userId = localStorage.getItem('metro_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('metro_user_id', userId);
  }
  return userId;
}

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
  userId: string;
  favorites: FavoriteLine[];
  favoriteLineIds: Set<string>;
  anomalies: TemperatureAnomaly[];
  anomaliesLoading: boolean;
  dismissedAnomalyIds: Set<string>;
  voteHistory: VoteHistoryRecord[];
  voteHistoryLoading: boolean;
  historyFilterLineId: string;
  historyFilterTimeSlot: TimeSlot;

  setLines: (lines: MetroLine[]) => void;
  setSelectedLineId: (id: string | null) => void;
  setSelectedCarriage: (num: number | null) => void;
  setCurrentLineStats: (stats: LineStats | null) => void;
  setCurrentTrend: (trend: TrendData[]) => void;
  setSelectedTimeSlot: (slot: TimeSlot) => void;
  setVoteSuccess: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
  setHistoryFilterLineId: (id: string) => void;
  setHistoryFilterTimeSlot: (slot: TimeSlot) => void;
  submitVote: (level: VoteLevel) => Promise<boolean>;
  fetchLines: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchTrend: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  fetchAnomalies: () => Promise<void>;
  fetchVoteHistory: () => Promise<void>;
  dismissAnomaly: (anomalyId: string) => void;
  toggleFavorite: (lineId: string) => Promise<boolean>;
  addFavorite: (lineId: string) => Promise<boolean>;
  removeFavorite: (lineId: string) => Promise<boolean>;
  isFavorite: (lineId: string) => boolean;
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
  userId: getOrCreateUserId(),
  favorites: [],
  favoriteLineIds: new Set<string>(),
  anomalies: [],
  anomaliesLoading: false,
  dismissedAnomalyIds: new Set<string>(),
  voteHistory: [],
  voteHistoryLoading: false,
  historyFilterLineId: 'all',
  historyFilterTimeSlot: 'all',

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
  setHistoryFilterLineId: (id) => set({ historyFilterLineId: id }),
  setHistoryFilterTimeSlot: (slot) => set({ historyFilterTimeSlot: slot }),

  isFavorite: (lineId: string) => {
    return get().favoriteLineIds.has(lineId);
  },

  submitVote: async (level) => {
    const { selectedLineId, selectedCarriage, userId } = get();
    if (!selectedLineId || !selectedCarriage) {
      set({ error: '请先选择线路和车厢' });
      return false;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
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

  fetchFavorites: async () => {
    const { userId } = get();
    try {
      const res = await fetch('/api/favorites', {
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      if (data.success) {
        const favorites: FavoriteLine[] = data.data;
        const favoriteLineIds = new Set(favorites.map((f) => f.lineId));
        set({ favorites, favoriteLineIds });
      }
    } catch {
      // silent fail
    }
  },

  addFavorite: async (lineId: string) => {
    const { userId } = get();
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ lineId }),
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchFavorites();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  removeFavorite: async (lineId: string) => {
    const { userId } = get();
    try {
      const res = await fetch(`/api/favorites/${lineId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchFavorites();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  toggleFavorite: async (lineId: string) => {
    const { isFavorite, addFavorite, removeFavorite } = get();
    if (isFavorite(lineId)) {
      return await removeFavorite(lineId);
    } else {
      return await addFavorite(lineId);
    }
  },

  fetchAnomalies: async () => {
    set({ anomaliesLoading: true });
    try {
      const res = await fetch('/api/stats/anomalies');
      const data = await res.json();
      if (data.success) {
        set({ anomalies: data.data, anomaliesLoading: false });
      } else {
        set({ anomaliesLoading: false });
      }
    } catch {
      set({ anomaliesLoading: false });
    }
  },

  dismissAnomaly: (anomalyId: string) => {
    const { dismissedAnomalyIds } = get();
    const newDismissed = new Set(dismissedAnomalyIds);
    newDismissed.add(anomalyId);
    set({ dismissedAnomalyIds: newDismissed });
  },

  fetchVoteHistory: async () => {
    const { userId, historyFilterLineId, historyFilterTimeSlot } = get();
    set({ voteHistoryLoading: true });
    try {
      const params = new URLSearchParams();
      if (historyFilterLineId && historyFilterLineId !== 'all') {
        params.append('lineId', historyFilterLineId);
      }
      if (historyFilterTimeSlot && historyFilterTimeSlot !== 'all') {
        params.append('timeSlot', historyFilterTimeSlot);
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/votes/history${query}`, {
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      if (data.success) {
        set({ voteHistory: data.data, voteHistoryLoading: false });
      } else {
        set({ voteHistoryLoading: false });
      }
    } catch {
      set({ voteHistoryLoading: false });
    }
  },
}));
