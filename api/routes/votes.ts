import { Router, type Request, type Response } from 'express';
import { dataStore } from '../data/store.js';
import type { VoteLevel, TimeSlot, VoteHistoryRecord } from '../../shared/types.js';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { lineId, carriageNumber, level, feedback } = req.body as {
    lineId: string;
    carriageNumber: number;
    level: VoteLevel;
    feedback?: string;
  };
  const userId = req.headers['x-user-id'] as string;

  if (!lineId || !carriageNumber || !level) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  if (!['cold', 'comfortable', 'hot'].includes(level)) {
    res.status(400).json({ success: false, error: 'Invalid vote level' });
    return;
  }

  if (feedback && (feedback.trim().length === 0 || feedback.trim().length > 50)) {
    res.status(400).json({ success: false, error: 'Feedback must be 1-50 characters' });
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

  const vote = dataStore.addVote(lineId, carriageNumber, level, userId);

  let feedbackData = null;
  if (feedback && feedback.trim().length > 0) {
    feedbackData = dataStore.addFeedback(
      lineId,
      carriageNumber,
      feedback.trim(),
      level,
      userId,
      vote.id,
    );
  }

  res.json({ success: true, data: { vote, feedback: feedbackData } });
});

router.get('/history', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || 'user_mock_history';
  const lineId = req.query.lineId as string | undefined;
  const timeSlot = req.query.timeSlot as TimeSlot | undefined;

  if (!userId) {
    res.status(400).json({ success: false, error: 'Missing user id' });
    return;
  }

  dataStore.ensureUserHistoryData(userId);

  const userVotes = dataStore.getUserVotes(userId, lineId, timeSlot);

  const records: VoteHistoryRecord[] = userVotes.map((v) => {
    const line = dataStore.getLineById(v.lineId);
    return {
      ...v,
      lineName: line?.name || v.lineId,
      lineColor: line?.color || '#888888',
    };
  });

  res.json({ success: true, data: records });
});

export default router;
