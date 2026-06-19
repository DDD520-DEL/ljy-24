import type { Vote, CarriageStats, LineStats, TrendData, TimeSlot, StationSectionStats, StationSection, TemperatureTrend } from '../../shared/types.js';
import { dataStore } from '../data/store.js';

function calculateTemperatureScore(cold: number, comfortable: number, hot: number): number {
  const total = cold + comfortable + hot;
  if (total === 0) return 0;
  return Math.round(((hot - cold) / total) * 100);
}

const TREND_WINDOW_HOURS = 3;
const TREND_THRESHOLD = 15;
const MIN_VOTES_PER_BUCKET = 2;

function predictCarriageTrend(lineId: string, carriageNumber: number): TemperatureTrend {
  const now = Date.now();
  const windowMs = TREND_WINDOW_HOURS * 3600 * 1000;
  const allVotes = dataStore.getVotesByLine(lineId);
  const votes = allVotes.filter(
    (v) => v.carriageNumber === carriageNumber && v.timestamp >= now - windowMs,
  );

  if (votes.length < 3) return 'stable';

  const bucketSize = windowMs / TREND_WINDOW_HOURS;

  interface Bucket {
    cold: number;
    comfortable: number;
    hot: number;
    total: number;
    score: number;
    startMs: number;
    endMs: number;
  }
  const buckets: Bucket[] = [];

  for (let i = 0; i < TREND_WINDOW_HOURS; i++) {
    const bucketStart = now - windowMs + i * bucketSize;
    const bucketEnd = bucketStart + bucketSize;
    const bucketVotes = votes.filter(
      (v) => v.timestamp >= bucketStart && v.timestamp < bucketEnd,
    );
    const cold = bucketVotes.filter((v) => v.level === 'cold').length;
    const comfortable = bucketVotes.filter((v) => v.level === 'comfortable').length;
    const hot = bucketVotes.filter((v) => v.level === 'hot').length;
    const total = cold + comfortable + hot;

    buckets.push({
      cold,
      comfortable,
      hot,
      total,
      score: total > 0 ? calculateTemperatureScore(cold, comfortable, hot) : 0,
      startMs: bucketStart,
      endMs: bucketEnd,
    });
  }

  const validBuckets = buckets.filter((b) => b.total >= MIN_VOTES_PER_BUCKET);

  if (validBuckets.length < 2) return 'stable';

  let risingWeight = 0;
  let fallingWeight = 0;

  for (let i = 1; i < validBuckets.length; i++) {
    const older = validBuckets[i - 1];
    const newer = validBuckets[i];
    const diff = newer.score - older.score;
    const confidence = Math.min(older.total, newer.total);

    if (diff > TREND_THRESHOLD) {
      risingWeight += confidence;
    } else if (diff < -TREND_THRESHOLD) {
      fallingWeight += confidence;
    }
  }

  const minConfidence = MIN_VOTES_PER_BUCKET;

  if (risingWeight > fallingWeight && risingWeight >= minConfidence) {
    return 'rising';
  }
  if (fallingWeight > risingWeight && fallingWeight >= minConfidence) {
    return 'falling';
  }
  return 'stable';
}

export function aggregateCarriageStats(
  votes: Vote[],
  carriageCount: number,
  lineId?: string,
): CarriageStats[] {
  const stats: CarriageStats[] = [];

  for (let i = 1; i <= carriageCount; i++) {
    const carriageVotes = votes.filter((v) => v.carriageNumber === i);
    const coldCount = carriageVotes.filter((v) => v.level === 'cold').length;
    const comfortableCount = carriageVotes.filter((v) => v.level === 'comfortable').length;
    const hotCount = carriageVotes.filter((v) => v.level === 'hot').length;
    const totalCount = carriageVotes.length;

    stats.push({
      carriageNumber: i,
      coldCount,
      comfortableCount,
      hotCount,
      totalCount,
      temperatureScore: calculateTemperatureScore(coldCount, comfortableCount, hotCount),
      trend: lineId ? predictCarriageTrend(lineId, i) : 'stable',
    });
  }

  return stats;
}

export function aggregateStationSectionStats(
  votes: Vote[],
  sections: StationSection[],
): StationSectionStats[] {
  const stats: StationSectionStats[] = [];

  for (const section of sections) {
    const sectionVotes = votes.filter((v) => v.stationSectionId === section.id);
    const coldCount = sectionVotes.filter((v) => v.level === 'cold').length;
    const comfortableCount = sectionVotes.filter((v) => v.level === 'comfortable').length;
    const hotCount = sectionVotes.filter((v) => v.level === 'hot').length;
    const totalCount = sectionVotes.length;

    stats.push({
      sectionId: section.id,
      sectionName: section.name,
      coldCount,
      comfortableCount,
      hotCount,
      totalCount,
      temperatureScore: calculateTemperatureScore(coldCount, comfortableCount, hotCount),
    });
  }

  return stats;
}

export function aggregateLineStats(lineId: string, timeSlot: TimeSlot): LineStats | null {
  const line = dataStore.getLineById(lineId);
  if (!line) return null;

  const votes = dataStore.getVotesByLine(lineId, timeSlot);
  const carriages = aggregateCarriageStats(votes, line.carriageCount, lineId);
  const stationSections = aggregateStationSectionStats(votes, line.stationSections);

  const totalVotes = votes.length;

  let coldestCarriage = 1;
  let hottestCarriage = 1;
  let minCarriageScore = Infinity;
  let maxCarriageScore = -Infinity;

  for (const c of carriages) {
    if (c.totalCount === 0) continue;
    if (c.temperatureScore < minCarriageScore) {
      minCarriageScore = c.temperatureScore;
      coldestCarriage = c.carriageNumber;
    }
    if (c.temperatureScore > maxCarriageScore) {
      maxCarriageScore = c.temperatureScore;
      hottestCarriage = c.carriageNumber;
    }
  }

  let coldestSection = '';
  let hottestSection = '';
  let minSectionScore = Infinity;
  let maxSectionScore = -Infinity;

  for (const s of stationSections) {
    if (s.totalCount === 0) continue;
    if (s.temperatureScore < minSectionScore) {
      minSectionScore = s.temperatureScore;
      coldestSection = s.sectionId;
    }
    if (s.temperatureScore > maxSectionScore) {
      maxSectionScore = s.temperatureScore;
      hottestSection = s.sectionId;
    }
  }

  const comfortableCount = votes.filter((v) => v.level === 'comfortable').length;
  const comfortRate = totalVotes > 0 ? Math.round((comfortableCount / totalVotes) * 100) : 0;

  return {
    lineId,
    timeSlot,
    carriages,
    stationSections,
    totalVotes,
    coldestCarriage,
    hottestCarriage,
    coldestSection,
    hottestSection,
    comfortRate,
  };
}

export function aggregateTrendData(lineId: string): TrendData[] {
  const votes = dataStore.getVotesByLine(lineId);
  const data: TrendData[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const hourVotes = votes.filter((v) => {
      const d = new Date(v.timestamp);
      return d.getHours() === hour;
    });

    data.push({
      hour,
      coldCount: hourVotes.filter((v) => v.level === 'cold').length,
      comfortableCount: hourVotes.filter((v) => v.level === 'comfortable').length,
      hotCount: hourVotes.filter((v) => v.level === 'hot').length,
    });
  }

  return data;
}

export function aggregateTrendDataForDate(
  lineId: string,
  date: Date,
): TrendData[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const votes = dataStore.getVotesByLineAndDateRange(
    lineId,
    startOfDay.getTime(),
    endOfDay.getTime(),
  );

  const data: TrendData[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const hourVotes = votes.filter((v) => {
      const d = new Date(v.timestamp);
      return d.getHours() === hour;
    });

    data.push({
      hour,
      coldCount: hourVotes.filter((v) => v.level === 'cold').length,
      comfortableCount: hourVotes.filter((v) => v.level === 'comfortable').length,
      hotCount: hourVotes.filter((v) => v.level === 'hot').length,
    });
  }

  return data;
}

export interface TrendComparisonResult {
  current: TrendData[];
  yesterday?: TrendData[];
  lastWeek?: TrendData[];
}

export function aggregateTrendDataWithComparison(
  lineId: string,
  includeYesterday: boolean,
  includeLastWeek: boolean,
): TrendComparisonResult {
  const now = new Date();
  const result: TrendComparisonResult = {
    current: aggregateTrendDataForDate(lineId, now),
  };

  if (includeYesterday) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    result.yesterday = aggregateTrendDataForDate(lineId, yesterday);
  }

  if (includeLastWeek) {
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    result.lastWeek = aggregateTrendDataForDate(lineId, lastWeek);
  }

  return result;
}
