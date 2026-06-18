export type VoteLevel = 'cold' | 'comfortable' | 'hot';

export type TimeSlot = 'morning' | 'evening' | 'offpeak' | 'all';

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  carriageCount: number;
}

export interface Vote {
  id: string;
  lineId: string;
  carriageNumber: number;
  level: VoteLevel;
  timestamp: number;
  timeSlot: TimeSlot;
}

export interface CarriageStats {
  carriageNumber: number;
  coldCount: number;
  comfortableCount: number;
  hotCount: number;
  totalCount: number;
  temperatureScore: number;
}

export interface LineStats {
  lineId: string;
  timeSlot: TimeSlot;
  carriages: CarriageStats[];
  totalVotes: number;
  coldestCarriage: number;
  hottestCarriage: number;
  comfortRate: number;
}

export interface TrendData {
  hour: number;
  coldCount: number;
  comfortableCount: number;
  hotCount: number;
}
