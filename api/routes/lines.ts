import { Router, type Request, type Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const lines = dataStore.getLines();
  res.json({ success: true, data: lines });
});

export default router;
