export type VoteLevel = 'cold' | 'comfortable' | 'hot';

export type TimeSlot = 'morning' | 'evening' | 'offpeak' | 'all';

export type HeatmapDimension = 'carriage' | 'station';

export interface MetroStation {
  id: string;
  name: string;
  index: number;
}

export interface StationSection {
  id: string;
  name: string;
  stationIndices: number[];
}

export interface LineTimetable {
  firstTrain: string;
  lastTrain: string;
  firstTrainWeekend?: string;
  lastTrainWeekend?: string;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  carriageCount: number;
  stations: MetroStation[];
  stationSections: StationSection[];
  timetable: LineTimetable;
}

export interface Vote {
  id: string;
  lineId: string;
  carriageNumber: number;
  level: VoteLevel;
  timestamp: number;
  timeSlot: TimeSlot;
  stationSectionId?: string;
  userId?: string;
  snapshotScore?: number;
  snapshotColdCount?: number;
  snapshotComfortableCount?: number;
  snapshotHotCount?: number;
  snapshotTotalCount?: number;
}

export interface VoteHistoryRecord extends Vote {
  lineName: string;
  lineColor: string;
}

export type TemperatureTrend = 'rising' | 'falling' | 'stable';

export interface CarriageStats {
  carriageNumber: number;
  coldCount: number;
  comfortableCount: number;
  hotCount: number;
  totalCount: number;
  temperatureScore: number;
  trend: TemperatureTrend;
}

export interface StationSectionStats {
  sectionId: string;
  sectionName: string;
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
  stationSections: StationSectionStats[];
  totalVotes: number;
  coldestCarriage: number;
  hottestCarriage: number;
  coldestSection: string;
  hottestSection: string;
  comfortRate: number;
}

export interface TrendData {
  hour: number;
  coldCount: number;
  comfortableCount: number;
  hotCount: number;
}

export type TrendCompareMode = 'none' | 'yesterday' | 'lastweek';

export interface TrendDataWithLabel extends TrendData {
  label: string;
}

export interface FavoriteLine {
  id: string;
  lineId: string;
  createdAt: number;
}

export type AnomalyType = 'sudden_cold' | 'sudden_hot' | 'volatile';

export interface TemperatureAnomaly {
  id: string;
  lineId: string;
  lineName: string;
  carriageNumber: number;
  type: AnomalyType;
  severity: 'warning' | 'danger';
  historicalDominantLevel: VoteLevel;
  recentDominantLevel: VoteLevel;
  recentVoteCount: number;
  historicalVoteCount: number;
  confidenceScore: number;
  detectedAt: number;
  suggestedAvoidStart: number;
  suggestedAvoidEnd: number;
  description: string;
}

export interface Feedback {
  id: string;
  lineId: string;
  carriageNumber: number;
  content: string;
  level: VoteLevel;
  timestamp: number;
  userId?: string;
  voteId?: string;
}

export interface FeedbackCountMap {
  [carriageNumber: number]: number;
}

export interface FeedbackListResponse {
  lineId: string;
  carriageNumber: number;
  total: number;
  feedbacks: Feedback[];
}

export interface UserImpactStats {
  totalVotes: number;
  linesCovered: number;
  helpCount: number;
}

export interface CarriageViewRecord {
  lineId: string;
  carriageNumber: number;
  viewerUserId?: string;
  timestamp: number;
}
