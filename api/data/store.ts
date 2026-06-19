import type { MetroLine, Vote, VoteLevel, TimeSlot, FavoriteLine } from '../../shared/types.js';

const LINES: MetroLine[] = [
  { id: 'line1', name: '1号线', color: '#C23A30', carriageCount: 6 },
  { id: 'line2', name: '2号线', color: '#006098', carriageCount: 6 },
  { id: 'line5', name: '5号线', color: '#A6217E', carriageCount: 6 },
  { id: 'line10', name: '10号线', color: '#0090A3', carriageCount: 8 },
  { id: 'line13', name: '13号线', color: '#F3D03E', carriageCount: 6 },
  { id: 'line14', name: '14号线', color: '#D4A455', carriageCount: 6 },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function getTimeSlotFromHour(hour: number): TimeSlot {
  if (hour >= 7 && hour <= 9) return 'morning';
  if (hour >= 17 && hour <= 19) return 'evening';
  return 'offpeak';
}

function generateMockVotes(): Vote[] {
  const votes: Vote[] = [];
  const now = Date.now();

  for (let dayOffset = 0; dayOffset <= 8; dayOffset++) {
    const dayBase = now - dayOffset * 24 * 3600 * 1000;
    const dayMultiplier = dayOffset === 0 ? 1 : (dayOffset === 1 || dayOffset === 7 ? 0.85 : 0.6);

    for (const line of LINES) {
      const voteCount = Math.floor((80 + Math.floor(Math.random() * 120)) * dayMultiplier);
      for (let i = 0; i < voteCount; i++) {
        const randomHourOffset = Math.floor(Math.random() * 24);
        const timestamp = dayBase - randomHourOffset * 3600 * 1000 - Math.floor(Math.random() * 3600 * 1000);
        const date = new Date(timestamp);
        const hour = date.getHours();
        const timeSlot = getTimeSlotFromHour(hour);

        let level: VoteLevel;
        const rand = Math.random();
        if (rand < 0.3) {
          level = 'cold';
        } else if (rand < 0.75) {
          level = 'comfortable';
        } else {
          level = 'hot';
        }

        votes.push({
          id: generateId(),
          lineId: line.id,
          carriageNumber: 1 + Math.floor(Math.random() * line.carriageCount),
          level,
          timestamp,
          timeSlot,
        });
      }
    }
  }

  injectAnomalyTestData(votes, now);

  return votes;
}

function injectAnomalyTestData(votes: Vote[], now: number): void {
  const targetLine = 'line1';
  const targetCarriage = 3;

  for (let i = 0; i < 30; i++) {
    const hourOffset = 1 + Math.floor(Math.random() * 23);
    const timestamp = now - hourOffset * 3600 * 1000 - Math.floor(Math.random() * 3600 * 1000);
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine,
      carriageNumber: targetCarriage,
      level: 'comfortable',
      timestamp,
      timeSlot,
    });
  }

  for (let i = 0; i < 12; i++) {
    const minutesAgo = Math.floor(Math.random() * 25);
    const timestamp = now - minutesAgo * 60 * 1000;
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine,
      carriageNumber: targetCarriage,
      level: 'cold',
      timestamp,
      timeSlot,
    });
  }

  const targetLine2 = 'line10';
  const targetCarriage2 = 5;

  for (let i = 0; i < 25; i++) {
    const hourOffset = 1 + Math.floor(Math.random() * 23);
    const timestamp = now - hourOffset * 3600 * 1000 - Math.floor(Math.random() * 3600 * 1000);
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine2,
      carriageNumber: targetCarriage2,
      level: 'comfortable',
      timestamp,
      timeSlot,
    });
  }

  for (let i = 0; i < 10; i++) {
    const minutesAgo = Math.floor(Math.random() * 25);
    const timestamp = now - minutesAgo * 60 * 1000;
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine2,
      carriageNumber: targetCarriage2,
      level: 'hot',
      timestamp,
      timeSlot,
    });
  }
}

function generateMockUserVotes(baseVotes: Vote[], lines: MetroLine[], userId: string): Vote[] {
  const userVotes: Vote[] = [];
  const now = Date.now();

  const voteTimes = [
    { daysAgo: 7, hour: 8, minute: 30 },
    { daysAgo: 6, hour: 18, minute: 15 },
    { daysAgo: 5, hour: 8, minute: 45 },
    { daysAgo: 4, hour: 12, minute: 20 },
    { daysAgo: 3, hour: 19, minute: 5 },
    { daysAgo: 2, hour: 7, minute: 55 },
    { daysAgo: 1, hour: 18, minute: 30 },
    { daysAgo: 0, hour: 9, minute: 10 },
    { daysAgo: 0, hour: 18, minute: 45 },
    { daysAgo: 0, hour: 14, minute: 20 },
  ];

  voteTimes.forEach((vt, idx) => {
    const line = lines[idx % lines.length];
    const carriage = 1 + (idx % line.carriageCount);
    const date = new Date(now);
    date.setDate(date.getDate() - vt.daysAgo);
    date.setHours(vt.hour, vt.minute, 0, 0);
    const timestamp = date.getTime();
    const timeSlot = getTimeSlotFromHour(vt.hour);

    const levels: VoteLevel[] = ['cold', 'comfortable', 'hot'];
    const level = levels[idx % 3];

    const relevantVotes = baseVotes.filter(
      (v) => v.lineId === line.id && v.carriageNumber === carriage && v.timestamp <= timestamp
    );
    const coldCount = relevantVotes.filter((v) => v.level === 'cold').length;
    const comfortableCount = relevantVotes.filter((v) => v.level === 'comfortable').length;
    const hotCount = relevantVotes.filter((v) => v.level === 'hot').length;
    const totalCount = coldCount + comfortableCount + hotCount;
    const snapshotScore = totalCount > 0
      ? Math.round(((hotCount - coldCount) / totalCount) * 100)
      : 0;

    userVotes.push({
      id: generateId(),
      lineId: line.id,
      carriageNumber: carriage,
      level,
      timestamp,
      timeSlot,
      userId,
      snapshotScore,
      snapshotColdCount: coldCount,
      snapshotComfortableCount: comfortableCount,
      snapshotHotCount: hotCount,
      snapshotTotalCount: totalCount,
    });
  });

  return userVotes;
}

class DataStore {
  private votes: Vote[] = [];
  private favorites: Map<string, FavoriteLine[]> = new Map();
  private initializedUsers: Set<string> = new Set();

  constructor() {
    const baseVotes = generateMockVotes();
    this.votes = [...baseVotes];
    this.ensureUserHistoryData('user_mock_history');
  }

  getLines(): MetroLine[] {
    return LINES;
  }

  getLineById(lineId: string): MetroLine | undefined {
    return LINES.find((l) => l.id === lineId);
  }

  getAllVotes(): Vote[] {
    return [...this.votes];
  }

  getVotesByLine(lineId: string, timeSlot?: TimeSlot): Vote[] {
    return this.votes.filter((v) => {
      if (v.lineId !== lineId) return false;
      if (timeSlot && timeSlot !== 'all' && v.timeSlot !== timeSlot) return false;
      return true;
    });
  }

  getVotesByLineAndDateRange(
    lineId: string,
    startOfDay: number,
    endOfDay: number,
    timeSlot?: TimeSlot,
  ): Vote[] {
    return this.votes.filter((v) => {
      if (v.lineId !== lineId) return false;
      if (v.timestamp < startOfDay || v.timestamp >= endOfDay) return false;
      if (timeSlot && timeSlot !== 'all' && v.timeSlot !== timeSlot) return false;
      return true;
    });
  }

  addVote(lineId: string, carriageNumber: number, level: VoteLevel, userId?: string): Vote {
    const now = Date.now();
    const hour = new Date(now).getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    const priorVotes = this.votes.filter(
      (v) => v.lineId === lineId && v.carriageNumber === carriageNumber && v.timestamp <= now
    );
    const snapshotColdCount = priorVotes.filter((v) => v.level === 'cold').length;
    const snapshotComfortableCount = priorVotes.filter((v) => v.level === 'comfortable').length;
    const snapshotHotCount = priorVotes.filter((v) => v.level === 'hot').length;
    const snapshotTotalCount = snapshotColdCount + snapshotComfortableCount + snapshotHotCount;
    const snapshotScore = snapshotTotalCount > 0
      ? Math.round(((snapshotHotCount - snapshotColdCount) / snapshotTotalCount) * 100)
      : 0;

    const vote: Vote = {
      id: generateId(),
      lineId,
      carriageNumber,
      level,
      timestamp: now,
      timeSlot,
      userId,
      snapshotScore,
      snapshotColdCount,
      snapshotComfortableCount,
      snapshotHotCount,
      snapshotTotalCount,
    };

    this.votes.push(vote);
    return vote;
  }

  ensureUserHistoryData(userId: string): void {
    if (this.initializedUsers.has(userId)) return;
    this.initializedUsers.add(userId);

    const existingCount = this.votes.filter((v) => v.userId === userId).length;
    if (existingCount > 0) return;

    const baseVotes = this.votes.filter((v) => !v.userId);
    const newUserVotes = generateMockUserVotes(baseVotes, LINES, userId);
    this.votes.push(...newUserVotes);
  }

  getUserVotes(userId: string, lineId?: string, timeSlot?: TimeSlot): Vote[] {
    return this.votes
      .filter((v) => {
        if (v.userId !== userId) return false;
        if (lineId && lineId !== 'all' && v.lineId !== lineId) return false;
        if (timeSlot && timeSlot !== 'all' && v.timeSlot !== timeSlot) return false;
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getFavorites(userId: string): FavoriteLine[] {
    return this.favorites.get(userId) || [];
  }

  isFavorite(userId: string, lineId: string): boolean {
    const userFavorites = this.favorites.get(userId) || [];
    return userFavorites.some((f) => f.lineId === lineId);
  }

  addFavorite(userId: string, lineId: string): FavoriteLine | null {
    if (!this.getLineById(lineId)) {
      return null;
    }
    if (this.isFavorite(userId, lineId)) {
      const userFavorites = this.favorites.get(userId) || [];
      return userFavorites.find((f) => f.lineId === lineId) || null;
    }
    const favorite: FavoriteLine = {
      id: generateId(),
      lineId,
      createdAt: Date.now(),
    };
    const userFavorites = this.favorites.get(userId) || [];
    userFavorites.push(favorite);
    this.favorites.set(userId, userFavorites);
    return favorite;
  }

  removeFavorite(userId: string, lineId: string): boolean {
    const userFavorites = this.favorites.get(userId) || [];
    const index = userFavorites.findIndex((f) => f.lineId === lineId);
    if (index === -1) {
      return false;
    }
    userFavorites.splice(index, 1);
    this.favorites.set(userId, userFavorites);
    return true;
  }
}

export const dataStore = new DataStore();
