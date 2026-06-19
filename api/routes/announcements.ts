import { Router, type Request, type Response } from 'express';
import type { Announcement } from '../../shared/types.js';

const router = Router();

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_001',
    type: 'maintenance',
    title: '系统维护通知',
    content: '6月22日凌晨2:00-4:00将进行系统升级维护，期间服务可能短暂中断，敬请谅解。',
    createdAt: now - 2 * 60 * 60 * 1000,
    startAt: now - day,
    endAt: now + 2 * day,
    priority: 100,
  },
  {
    id: 'ann_002',
    type: 'success',
    title: '新功能上线',
    content: '热力图页面新增趋势对比功能，可与昨日或上周数据进行对比，快来体验吧！',
    link: '/heatmap',
    linkText: '立即查看',
    createdAt: now - 5 * 60 * 60 * 1000,
    startAt: now - 3 * day,
    endAt: now + 7 * day,
    priority: 80,
  },
  {
    id: 'ann_003',
    type: 'info',
    title: '使用提示',
    content: '投票后可在历史记录页面查看您的所有投票记录，并导出为CSV文件。',
    link: '/history',
    linkText: '查看历史',
    createdAt: now - 24 * 60 * 60 * 1000,
    startAt: now - 5 * day,
    endAt: now + 30 * day,
    priority: 50,
  },
  {
    id: 'ann_004',
    type: 'warning',
    title: '高温预警',
    content: '近日气温升高，部分线路车厢温度可能偏高，建议携带饮水，注意防暑降温。',
    createdAt: now - 3 * 60 * 60 * 1000,
    startAt: now - 12 * 60 * 60 * 1000,
    endAt: now + 5 * day,
    priority: 90,
  },
];

router.get('/', (_req: Request, res: Response) => {
  const currentTime = Date.now();
  const activeAnnouncements = MOCK_ANNOUNCEMENTS.filter(
    (a) => a.startAt <= currentTime && a.endAt >= currentTime
  ).sort((a, b) => b.priority - a.priority);

  res.json({
    success: true,
    data: {
      announcements: activeAnnouncements,
      total: activeAnnouncements.length,
    },
  });
});

export default router;
