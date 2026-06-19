import type { Vote, CarriageStats, LineStats, TrendData, TimeSlot, StationSectionStats, StationSection } from '../../shared/types.js';
import { dataStore } from '../data/store.js';

function calculateTemperatureScore(cold: number, comfortable: number, hot: number): number {
  const total = cold + comfortable + hot;
  if (total === 0) return 0;
  return Math.round(((hot - cold) / total) * 100);
}

export function aggregateCarriageStats(
  votes: Vote[],
  carriageCount: number,
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
  const carriages = aggregateCarriageStats(votes, line.carriageCount);
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
