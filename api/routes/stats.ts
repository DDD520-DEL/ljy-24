import { Router, type Request, type Response } from 'express';
import {
  aggregateLineStats,
  aggregateTrendData,
  aggregateTrendDataWithComparison,
} from '../services/aggregator.js';
import { detectAnomalies } from '../services/anomalyDetector.js';
import type { TimeSlot, TrendCompareMode } from '../../shared/types.js';
import { dataStore } from '../data/store.js';

const router = Router();

function escapeCsvField(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

router.get('/anomalies', (_req: Request, res: Response) => {
  try {
    const anomalies = detectAnomalies();
    res.json({ success: true, data: anomalies });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to detect anomalies' });
  }
});

router.get('/:lineId/export', (req: Request, res: Response) => {
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

  const line = dataStore.getLineById(lineId);
  const lineName = line?.name || lineId;

  const rows: string[][] = [];

  rows.push(['线路统计导出']);
  rows.push([]);
  rows.push(['基本信息']);
  rows.push(['线路', lineName]);
  rows.push(['线路ID', lineId]);
  rows.push(['时段', timeSlot]);
  rows.push(['总投票数', String(stats.totalVotes)]);
  rows.push(['舒适率', `${stats.comfortRate}%`]);
  rows.push(['最冷车厢', `${stats.coldestCarriage}号车厢`]);
  rows.push(['最闷车厢', `${stats.hottestCarriage}号车厢`]);
  rows.push([]);

  rows.push(['车厢统计数据']);
  rows.push(['车厢号', '冷票数', '舒适票数', '热票数', '总票数', '温度评分']);
  for (const c of stats.carriages) {
    rows.push([
      String(c.carriageNumber),
      String(c.coldCount),
      String(c.comfortableCount),
      String(c.hotCount),
      String(c.totalCount),
      String(c.temperatureScore),
    ]);
  }
  rows.push([]);

  rows.push(['站点段统计数据']);
  rows.push(['站点段ID', '站点段名称', '冷票数', '舒适票数', '热票数', '总票数', '温度评分']);
  for (const s of stats.stationSections) {
    rows.push([
      s.sectionId,
      s.sectionName,
      String(s.coldCount),
      String(s.comfortableCount),
      String(s.hotCount),
      String(s.totalCount),
      String(s.temperatureScore),
    ]);
  }

  const bom = '\uFEFF';
  const csvContent = bom + rows.map((row) => row.map(escapeCsvField).join(',')).join('\n');

  const filename = `${lineName}_${timeSlot}_统计数据.csv`;
  const encodedFilename = encodeURIComponent(filename);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
  res.send(csvContent);
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
