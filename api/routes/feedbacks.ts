import { Router, type Request, type Response } from 'express';
import { dataStore } from '../data/store.js';
import type { VoteLevel } from '../../shared/types.js';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { lineId, carriageNumber, content, level, voteId } = req.body as {
    lineId: string;
    carriageNumber: number;
    content: string;
    level: VoteLevel;
    voteId?: string;
  };
  const userId = req.headers['x-user-id'] as string;

  if (!lineId || !carriageNumber || !content || !level) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    res.status(400).json({ success: false, error: 'Feedback content cannot be empty' });
    return;
  }
  if (trimmedContent.length > 50) {
    res.status(400).json({ success: false, error: 'Feedback content exceeds 50 characters' });
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

  const feedback = dataStore.addFeedback(lineId, carriageNumber, trimmedContent, level, userId, voteId);
  res.json({ success: true, data: feedback });
});

router.get('/counts/:lineId', (req: Request, res: Response) => {
  const { lineId } = req.params;

  const line = dataStore.getLineById(lineId);
  if (!line) {
    res.status(404).json({ success: false, error: 'Line not found' });
    return;
  }

  const countMap = dataStore.getFeedbackCountMap(lineId);
  res.json({ success: true, data: countMap });
});

router.get('/:lineId/:carriageNumber', (req: Request, res: Response) => {
  const { lineId, carriageNumber } = req.params;
  const limit = parseInt(req.query.limit as string) || 50;

  const line = dataStore.getLineById(lineId);
  if (!line) {
    res.status(404).json({ success: false, error: 'Line not found' });
    return;
  }

  const carriageNum = parseInt(carriageNumber);
  if (isNaN(carriageNum) || carriageNum < 1 || carriageNum > line.carriageCount) {
    res.status(400).json({ success: false, error: 'Invalid carriage number' });
    return;
  }

  const feedbacks = dataStore.getFeedbacksByCarriage(lineId, carriageNum, limit);
  const total = dataStore.getFeedbackCountByCarriage(lineId, carriageNum);
  res.json({
    success: true,
    data: {
      lineId,
      carriageNumber: carriageNum,
      total,
      feedbacks,
    },
  });
});

export default router;
