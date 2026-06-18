import type { MetroLine, Vote, VoteLevel, TimeSlot } from '../../shared/types.js';

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

  for (const line of LINES) {
    const voteCount = 150 + Math.floor(Math.random() * 200);
    for (let i = 0; i < voteCount; i++) {
      const randomHourOffset = Math.floor(Math.random() * 24);
      const timestamp = now - randomHourOffset * 3600 * 1000 - Math.floor(Math.random() * 3600 * 1000);
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

  return votes;
}

class DataStore {
  private votes: Vote[] = [];

  constructor() {
    this.votes = generateMockVotes();
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

  addVote(lineId: string, carriageNumber: number, level: VoteLevel): Vote {
    const now = Date.now();
    const hour = new Date(now).getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    const vote: Vote = {
      id: generateId(),
      lineId,
      carriageNumber,
      level,
      timestamp: now,
      timeSlot,
    };

    this.votes.push(vote);
    return vote;
  }
}

export const dataStore = new DataStore();
