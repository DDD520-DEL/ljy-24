import { Router, type Request, type Response } from 'express';
import {
  aggregateLineStats,
  aggregateTrendData,
  aggregateTrendDataWithComparison,
} from '../services/aggregator.js';
import { detectAnomalies } from '../services/anomalyDetector.js';
import type { TimeSlot, TrendCompareMode } from '../../shared/types.js';

const router = Router();

router.get('/anomalies', (_req: Request, res: Response) => {
  try {
    const anomalies = detectAnomalies();
    res.json({ success: true, data: anomalies });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to detect anomalies' });
  }
});

router.get('/:lineId', (req: Request, res: Response) => {
  const { lineId } = req.params;
  const timeSlot = (req.query.timeSlot as TimeSlot) || 'all';

  if (!['morning', 'evening', 'offpeak', 'all'].includes(timeSlot)) {
    res.status(400).json({ success: false, error: 'Invalid time slot' });
    return;
  }

  const stats = aggregateLineStats(lineId, timeSlot);
  if (!stats) {
    res.status(404).json({ success: false, error: 'Line not found' });
    return;
  }

  res.json({ success: true, data: stats });
});

router.get('/:lineId/trend', (req: Request, res: Response) => {
  const { lineId } = req.params;
  const compare = (req.query.compare as TrendCompareMode) || 'none';

  if (!['none', 'yesterday', 'lastweek'].includes(compare)) {
    res.status(400).json({ success: false, error: 'Invalid compare mode' });
    return;
  }

  if (compare === 'none') {
    const trend = aggregateTrendData(lineId);
    res.json({ success: true, data: { current: trend } });
  } else {
    const includeYesterday = compare === 'yesterday';
    const includeLastWeek = compare === 'lastweek';
    const result = aggregateTrendDataWithComparison(lineId, includeYesterday, includeLastWeek);
    res.json({ success: true, data: result });
  }
});

export default router;
