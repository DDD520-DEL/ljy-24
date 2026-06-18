import { Router, type Request, type Response } from 'express';
import { dataStore } from '../data/store.js';
import type { VoteLevel } from '../../shared/types.js';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { lineId, carriageNumber, level } = req.body as {
    lineId: string;
    carriageNumber: number;
    level: VoteLevel;
  };

  if (!lineId || !carriageNumber || !level) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  if (!['cold', 'comfortable', 'hot'].includes(level)) {
    res.status(400).json({ success: false, error: 'Invalid vote level' });
    return;
  }

  const line = dataStore.getLineById(lineId);
  if (!line) {
    res.status(404).json({ success: false, error: 'Line not found' });
    return;
  }

  if (carriageNumber < 1 || carriageNumber > line.carriageCount) {
    res.status(400).json({ success: false, error: 'Invalid carriage number' });
    return;
  }

  const vote = dataStore.addVote(lineId, carriageNumber, level);
  res.json({ success: true, data: vote });
});

export default router;
