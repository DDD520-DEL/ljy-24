import { create } from 'zustand';
import type {
  MetroLine,
  VoteLevel,
  TimeSlot,
  LineStats,
  TrendData,
  FavoriteLine,
  TemperatureAnomaly,
  VoteHistoryRecord,
  TrendCompareMode,
  Feedback,
  FeedbackCountMap,
  FeedbackListResponse,
  HeatmapDimension,
  UserImpactStats,
  WeatherData,
  Announcement,
} from '../../shared/types.js';

function getOrCreateUserId(): string {
  let userId = localStorage.getItem('metro_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('metro_user_id', userId);
  }
  return userId;
}

function getStoredAnnouncementsCollapsed(): boolean {
  try {
    const stored = localStorage.getItem('metro_announcement_collapsed');
    return stored === 'true';
  } catch {
    return false;
  }
}

function getStoredDismissedAnnouncementIds(): Set<string> {
  try {
    const stored = localStorage.getItem('metro_announcement_dismissed');
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // ignore
  }
  return new Set<string>();
}

interface TrendComparisonData {
  current: TrendData[];
  yesterday?: TrendData[];
  lastWeek?: TrendData[];
}

interface AppState {
  lines: MetroLine[];
  selectedLineId: string | null;
  selectedCarriage: number | null;
  selectedStationSectionId: string | null;
  currentLineStats: LineStats | null;
  currentTrend: TrendData[];
  trendComparison: TrendComparisonData;
  trendCompareMode: TrendCompareMode;
  selectedTimeSlot: TimeSlot;
  heatmapDimension: HeatmapDimension;
  voteSuccess: boolean;
  lastVoteLevel: VoteLevel | null;
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
  feedbackCountMap: FeedbackCountMap;
  feedbackCountLoading: boolean;
  feedbackModalOpen: boolean;
  selectedFeedbackCarriage: number | null;
  feedbackList: Feedback[];
  feedbackListLoading: boolean;
  feedbackListTotal: number;
  exportLoading: boolean;
  userImpactStats: UserImpactStats | null;
  userImpactLoading: boolean;
  weather: WeatherData | null;
  weatherLoading: boolean;
  announcements: Announcement[];
  announcementsLoading: boolean;
  announcementsCollapsed: boolean;
  dismissedAnnouncementIds: Set<string>;
  lastUpdated: Date | null;
  refreshLoading: boolean;

  setLines: (lines: MetroLine[]) => void;
  setSelectedLineId: (id: string | null) => void;
  setSelectedCarriage: (num: number | null) => void;
  setSelectedStationSectionId: (id: string | null) => void;
  setCurrentLineStats: (stats: LineStats | null) => void;
  setCurrentTrend: (trend: TrendData[]) => void;
  setTrendCompareMode: (mode: TrendCompareMode) => void;
  setSelectedTimeSlot: (slot: TimeSlot) => void;
  setHeatmapDimension: (dim: HeatmapDimension) => void;
  setVoteSuccess: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
  setHistoryFilterLineId: (id: string) => void;
  setHistoryFilterTimeSlot: (slot: TimeSlot) => void;
  submitVote: (level: VoteLevel) => Promise<boolean>;
  submitFeedback: (content: string) => Promise<boolean>;
  fetchLines: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchTrend: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  fetchAnomalies: () => Promise<void>;
  fetchVoteHistory: () => Promise<void>;
  fetchFeedbackCounts: () => Promise<void>;
  fetchFeedbackList: (carriageNumber: number) => Promise<void>;
  openFeedbackModal: (carriageNumber: number) => void;
  closeFeedbackModal: () => void;
  exportStats: () => Promise<void>;
  dismissAnomaly: (anomalyId: string) => void;
  toggleFavorite: (lineId: string) => Promise<boolean>;
  addFavorite: (lineId: string) => Promise<boolean>;
  removeFavorite: (lineId: string) => Promise<boolean>;
  isFavorite: (lineId: string) => boolean;
  fetchUserImpactStats: () => Promise<void>;
  fetchWeather: () => Promise<void>;
  recordCarriageView: (lineId: string, carriageNumber: number) => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  toggleAnnouncementsCollapsed: () => void;
  dismissAnnouncement: (announcementId: string) => void;
  refreshData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  lines: [],
  selectedLineId: null,
  selectedCarriage: null,
  selectedStationSectionId: null,
  currentLineStats: null,
  currentTrend: [],
  trendComparison: { current: [] },
  trendCompareMode: 'none',
  selectedTimeSlot: 'all',
  heatmapDimension: 'carriage',
  voteSuccess: false,
  lastVoteLevel: null,
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
  feedbackCountMap: {},
  feedbackCountLoading: false,
  feedbackModalOpen: false,
  selectedFeedbackCarriage: null,
  feedbackList: [],
  feedbackListLoading: false,
  feedbackListTotal: 0,
  exportLoading: false,
  userImpactStats: null,
  userImpactLoading: false,
  weather: null,
  weatherLoading: false,
  announcements: [],
  announcementsLoading: false,
  announcementsCollapsed: getStoredAnnouncementsCollapsed(),
  dismissedAnnouncementIds: getStoredDismissedAnnouncementIds(),
  lastUpdated: null,
  refreshLoading: false,

  setLines: (lines) => set({ lines }),
  setSelectedLineId: (id) => {
    set({ selectedLineId: id, selectedCarriage: null, selectedStationSectionId: null, currentLineStats: null });
  },
  setSelectedCarriage: (num) => set({ selectedCarriage: num }),
  setSelectedStationSectionId: (id) => set({ selectedStationSectionId: id }),
  setCurrentLineStats: (stats) => set({ currentLineStats: stats }),
  setCurrentTrend: (trend) => set({ currentTrend: trend }),
  setTrendCompareMode: (mode) => {
    set({ trendCompareMode: mode });
    get().fetchTrend();
  },
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setHeatmapDimension: (dim) => set({ heatmapDimension: dim }),
  setVoteSuccess: (val) => set({ voteSuccess: val }),
  setLoading: (val) => set({ loading: val }),
  setError: (err) => set({ error: err }),
  setHistoryFilterLineId: (id) => set({ historyFilterLineId: id }),
  setHistoryFilterTimeSlot: (slot) => set({ historyFilterTimeSlot: slot }),

  isFavorite: (lineId: string) => {
    return get().favoriteLineIds.has(lineId);
  },

  submitVote: async (level) => {
    const { selectedLineId, selectedCarriage, selectedStationSectionId, userId } = get();
    if (!selectedLineId || !selectedCarriage) {
      set({ error: '请先选择线路和车厢' });
      return false;
    }

    set({ loading: true, error: null });
    try {
      const body: Record<string, string | number> = {
        lineId: selectedLineId,
        carriageNumber: selectedCarriage,
        level,
      };
      if (selectedStationSectionId) {
        body.stationSectionId = selectedStationSectionId;
      }

      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        set({ voteSuccess: true, lastVoteLevel: level, loading: false });
        if (get().voteHistory.length > 0) {
          get().fetchVoteHistory();
        }
        get().fetchUserImpactStats();
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

  submitFeedback: async (content) => {
    const { selectedLineId, selectedCarriage, lastVoteLevel, userId } = get();
    if (!selectedLineId || !selectedCarriage || !lastVoteLevel) {
      set({ error: '缺少投票信息，请先投票' });
      return false;
    }
    if (!content || content.trim().length === 0 || content.length > 50) {
      set({ error: '留言内容必须在1-50字之间' });
      return false;
    }

    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          lineId: selectedLineId,
          carriageNumber: selectedCarriage,
          content: content.trim(),
          level: lastVoteLevel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        get().fetchFeedbackCounts();
        return true;
      } else {
        set({ error: data.error || '留言提交失败' });
        return false;
      }
    } catch {
      set({ error: '网络错误' });
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
        set({ currentLineStats: data.data, loading: false, lastUpdated: new Date() });
      } else {
        set({ error: data.error || '获取统计失败', loading: false });
      }
    } catch {
      set({ error: '网络错误', loading: false });
    }
  },

  fetchTrend: async () => {
    const { selectedLineId, trendCompareMode } = get();
    if (!selectedLineId) return;

    try {
      const params = new URLSearchParams();
      if (trendCompareMode && trendCompareMode !== 'none') {
        params.append('compare', trendCompareMode);
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/stats/${selectedLineId}/trend${query}`);
      const data = await res.json();
      if (data.success) {
        const comparison = data.data as TrendComparisonData;
        set({
          currentTrend: comparison.current || [],
          trendComparison: comparison,
        });
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

  fetchFeedbackCounts: async () => {
    const { selectedLineId } = get();
    if (!selectedLineId) return;

    set({ feedbackCountLoading: true });
    try {
      const res = await fetch(`/api/feedbacks/counts/${selectedLineId}`);
      const data = await res.json();
      if (data.success) {
        set({ feedbackCountMap: data.data, feedbackCountLoading: false });
      } else {
        set({ feedbackCountLoading: false });
      }
    } catch {
      set({ feedbackCountLoading: false });
    }
  },

  fetchFeedbackList: async (carriageNumber: number) => {
    const { selectedLineId } = get();
    if (!selectedLineId) return;

    set({ feedbackListLoading: true });
    try {
      const res = await fetch(`/api/feedbacks/${selectedLineId}/${carriageNumber}`);
      const data = await res.json();
      if (data.success) {
        const resp = data.data as FeedbackListResponse;
        set({
          feedbackList: resp.feedbacks,
          feedbackListTotal: resp.total,
          feedbackListLoading: false,
        });
      } else {
        set({ feedbackListLoading: false });
      }
    } catch {
      set({ feedbackListLoading: false });
    }
  },

  openFeedbackModal: (carriageNumber: number) => {
    set({
      feedbackModalOpen: true,
      selectedFeedbackCarriage: carriageNumber,
      feedbackList: [],
      feedbackListTotal: 0,
    });
    get().fetchFeedbackList(carriageNumber);
  },

  closeFeedbackModal: () => {
    set({
      feedbackModalOpen: false,
      selectedFeedbackCarriage: null,
      feedbackList: [],
      feedbackListTotal: 0,
    });
  },

  exportStats: async () => {
    const { selectedLineId, selectedTimeSlot } = get();
    if (!selectedLineId) return;

    set({ exportLoading: true });
    try {
      const res = await fetch(`/api/stats/${selectedLineId}/export?timeSlot=${selectedTimeSlot}`);
      if (!res.ok) {
        set({ error: '导出失败', exportLoading: false });
        return;
      }
      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition') || '';
      let filename = '统计数据.csv';
      const match = contentDisposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      } else {
        const asciiMatch = contentDisposition.match(/filename="(.+?)"/);
        if (asciiMatch && asciiMatch[1]) {
          filename = decodeURIComponent(asciiMatch[1]);
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      set({ exportLoading: false });
    } catch {
      set({ error: '导出失败', exportLoading: false });
    }
  },

  fetchUserImpactStats: async () => {
    const { userId } = get();
    set({ userImpactLoading: true });
    try {
      const res = await fetch('/api/stats/user-impact', {
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      if (data.success) {
        set({ userImpactStats: data.data, userImpactLoading: false });
      } else {
        set({ userImpactLoading: false });
      }
    } catch {
      set({ userImpactLoading: false });
    }
  },

  fetchWeather: async () => {
    set({ weatherLoading: true });
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      if (data.success) {
        set({ weather: data.data, weatherLoading: false });
      } else {
        set({ weatherLoading: false });
      }
    } catch {
      set({ weatherLoading: false });
    }
  },

  recordCarriageView: async (lineId: string, carriageNumber: number) => {
    const { userId } = get();
    try {
      await fetch('/api/stats/carriage-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ lineId, carriageNumber }),
      });
    } catch {
      // silent fail
    }
  },

  fetchAnnouncements: async () => {
    set({ announcementsLoading: true });
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success) {
        set({ announcements: data.data.announcements || [], announcementsLoading: false });
      } else {
        set({ announcementsLoading: false });
      }
    } catch {
      set({ announcementsLoading: false });
    }
  },

  toggleAnnouncementsCollapsed: () => {
    set((state) => {
      const newValue = !state.announcementsCollapsed;
      try {
        localStorage.setItem('metro_announcement_collapsed', String(newValue));
      } catch {
        // ignore
      }
      return { announcementsCollapsed: newValue };
    });
  },

  dismissAnnouncement: (announcementId: string) => {
    const { dismissedAnnouncementIds } = get();
    const newDismissed = new Set(dismissedAnnouncementIds);
    newDismissed.add(announcementId);
    try {
      localStorage.setItem('metro_announcement_dismissed', JSON.stringify(Array.from(newDismissed)));
    } catch {
      // ignore
    }
    set({ dismissedAnnouncementIds: newDismissed });
  },

  refreshData: async () => {
    const { selectedLineId } = get();
    if (!selectedLineId) return;

    set({ refreshLoading: true });
    try {
      await Promise.all([
        get().fetchStats(),
        get().fetchTrend(),
        get().fetchFeedbackCounts(),
      ]);
    } finally {
      set({ refreshLoading: false });
    }
  },
}));
