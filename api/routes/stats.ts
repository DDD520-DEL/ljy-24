import { Router, type Request, type Response } from 'express';
import { aggregateLineStats, aggregateTrendData } from '../services/aggregator.js';
import type { TimeSlot } from '../../shared/types.js';

const router = Router();

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
  const trend = aggregateTrendData(lineId);
  res.json({ success: true, data: trend });
});

export default router;
