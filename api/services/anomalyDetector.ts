import type { Vote, VoteLevel, TemperatureAnomaly, AnomalyType } from '../../shared/types.js';
import { dataStore } from '../data/store.js';

const RECENT_WINDOW_MS = 30 * 60 * 1000;
const MIN_RECENT_VOTES = 5;
const MIN_HISTORICAL_VOTES = 10;
const DANGER_CONFIDENCE_THRESHOLD = 70;
const WARNING_CONFIDENCE_THRESHOLD = 50;
const SHIFT_MAGNITUDE_THRESHOLD = 0.4;

function getDominantLevel(votes: Vote[]): VoteLevel | null {
  if (votes.length === 0) return null;

  const counts = {
    cold: votes.filter(v => v.level === 'cold').length,
    comfortable: votes.filter(v => v.level === 'comfortable').length,
    hot: votes.filter(v => v.level === 'hot').length,
  };

  const total = votes.length;
  const ratios = {
    cold: counts.cold / total,
    comfortable: counts.comfortable / total,
    hot: counts.hot / total,
  };

  let maxRatio = 0;
  let dominant: VoteLevel = 'comfortable';

  for (const [level, ratio] of Object.entries(ratios)) {
    if (ratio > maxRatio) {
      maxRatio = ratio;
      dominant = level as VoteLevel;
    }
  }

  return dominant;
}

function getLevelRatio(votes: Vote[], level: VoteLevel): number {
  if (votes.length === 0) return 0;
  return votes.filter(v => v.level === level).length / votes.length;
}

function areLevelsOpposite(level1: VoteLevel, level2: VoteLevel): boolean {
  return (level1 === 'cold' && level2 === 'hot') || (level1 === 'hot' && level2 === 'cold');
}

function determineAnomalyType(
  historicalDominant: VoteLevel,
  recentDominant: VoteLevel,
): AnomalyType {
  if (historicalDominant === 'comfortable') {
    if (recentDominant === 'cold') return 'sudden_cold';
    if (recentDominant === 'hot') return 'sudden_hot';
  }
  if (historicalDominant === 'cold' && recentDominant === 'hot') return 'sudden_hot';
  if (historicalDominant === 'hot' && recentDominant === 'cold') return 'sudden_cold';
  return 'volatile';
}

function calculateConfidence(
  historicalVotes: Vote[],
  recentVotes: Vote[],
  historicalDominant: VoteLevel,
  recentDominant: VoteLevel,
): number {
  const recentCount = recentVotes.length;
  const historicalCount = historicalVotes.length;

  const historicalRatio = getLevelRatio(historicalVotes, historicalDominant);
  const recentRatio = getLevelRatio(recentVotes, recentDominant);

  const countScore = Math.min((recentCount / 15) * 30, 30);
  const magnitudeScore = Math.min(Math.abs(recentRatio - historicalRatio) * 100, 40);
  const oppositeBonus = areLevelsOpposite(historicalDominant, recentDominant) ? 20 : 10;
  const historicalConfidence = Math.min((historicalCount / 30) * 10, 10);

  return Math.round(countScore + magnitudeScore + oppositeBonus + historicalConfidence);
}

function getDescription(
  type: AnomalyType,
  lineName: string,
  carriageNumber: number,
  historicalDominant: VoteLevel,
  recentDominant: VoteLevel,
): string {
  const levelText: Record<VoteLevel, string> = {
    cold: '凉爽',
    comfortable: '舒适',
    hot: '闷热',
  };

  const typeText: Record<AnomalyType, string> = {
    sudden_cold: '温度骤降',
    sudden_hot: '温度骤升',
    volatile: '温度波动异常',
  };

  return `${lineName} ${carriageNumber}号车厢出现${typeText[type]}：历史以"${levelText[historicalDominant]}"为主，近期突然集中出现"${levelText[recentDominant]}"投票，可能存在空调故障。`;
}

function generateAnomalyId(): string {
  return 'anomaly_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function detectAnomalies(): TemperatureAnomaly[] {
  const anomalies: TemperatureAnomaly[] = [];
  const now = Date.now();
  const recentCutoff = now - RECENT_WINDOW_MS;

  const lines = dataStore.getLines();
  const allVotes = dataStore.getAllVotes();

  for (const line of lines) {
    const lineVotes = allVotes.filter(v => v.lineId === line.id);

    for (let carriageNum = 1; carriageNum <= line.carriageCount; carriageNum++) {
      const carriageVotes = lineVotes.filter(v => v.carriageNumber === carriageNum);

      const recentVotes = carriageVotes.filter(v => v.timestamp >= recentCutoff);
      const historicalVotes = carriageVotes.filter(v => v.timestamp < recentCutoff);

      if (recentVotes.length < MIN_RECENT_VOTES || historicalVotes.length < MIN_HISTORICAL_VOTES) {
        continue;
      }

      const historicalDominant = getDominantLevel(historicalVotes);
      const recentDominant = getDominantLevel(recentVotes);

      if (!historicalDominant || !recentDominant) continue;

      if (historicalDominant === recentDominant) continue;

      const historicalRatio = getLevelRatio(historicalVotes, historicalDominant);
      const recentRatio = getLevelRatio(recentVotes, recentDominant);
      const shiftMagnitude = Math.abs(recentRatio - (1 - historicalRatio));

      if (shiftMagnitude < SHIFT_MAGNITUDE_THRESHOLD) continue;

      const confidence = calculateConfidence(
        historicalVotes,
        recentVotes,
        historicalDominant,
        recentDominant,
      );

      if (confidence < WARNING_CONFIDENCE_THRESHOLD) continue;

      const type = determineAnomalyType(historicalDominant, recentDominant);
      const severity = confidence >= DANGER_CONFIDENCE_THRESHOLD ? 'danger' : 'warning';

      const anomaly: TemperatureAnomaly = {
        id: generateAnomalyId(),
        lineId: line.id,
        lineName: line.name,
        carriageNumber: carriageNum,
        type,
        severity,
        historicalDominantLevel: historicalDominant,
        recentDominantLevel: recentDominant,
        recentVoteCount: recentVotes.length,
        historicalVoteCount: historicalVotes.length,
        confidenceScore: confidence,
        detectedAt: now,
        suggestedAvoidStart: now,
        suggestedAvoidEnd: now + 2 * 60 * 60 * 1000,
        description: getDescription(type, line.name, carriageNum, historicalDominant, recentDominant),
      };

      anomalies.push(anomaly);
    }
  }

  anomalies.sort((a, b) => b.confidenceScore - a.confidenceScore);
  return anomalies;
}
