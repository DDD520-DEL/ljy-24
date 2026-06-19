import { Router, type Request, type Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

function getUserId(req: Request): string {
  const userId = req.headers['x-user-id'] as string | undefined;
  if (userId) return userId;
  const fallbackId = req.query.userId as string | undefined;
  if (fallbackId) return fallbackId;
  return 'anonymous';
}

router.get('/', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const favorites = dataStore.getFavorites(userId);
  res.json({ success: true, data: favorites });
});

router.get('/check/:lineId', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { lineId } = req.params;
  const isFav = dataStore.isFavorite(userId, lineId);
  res.json({ success: true, data: { lineId, isFavorite: isFav } });
});

router.post('/', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { lineId } = req.body as { lineId: string };

  if (!lineId) {
    res.status(400).json({ success: false, error: 'Missing required field: lineId' });
    return;
  }

  const line = dataStore.getLineById(lineId);
  if (!line) {
    res.status(404).json({ success: false, error: 'Line not found' });
    return;
  }

  const favorite = dataStore.addFavorite(userId, lineId);
  if (!favorite) {
    res.status(400).json({ success: false, error: 'Failed to add favorite' });
    return;
  }

  res.json({ success: true, data: favorite });
});

router.delete('/:lineId', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { lineId } = req.params;

  const removed = dataStore.removeFavorite(userId, lineId);
  if (!removed) {
    res.status(404).json({ success: false, error: 'Favorite not found' });
    return;
  }

  res.json({ success: true, data: { lineId } });
});

export default router;
