export function getHeatColorClass(score: number): string {
  if (score <= -60) return 'heat-cold';
  if (score <= -20) return 'heat-cool';
  if (score <= 20) return 'heat-comfort';
  if (score <= 60) return 'heat-warm';
  return 'heat-hot';
}

export function getHeatLabel(score: number): string {
  if (score <= -60) return '冻僵';
  if (score <= -20) return '偏冷';
  if (score <= 20) return '舒适';
  if (score <= 60) return '偏热';
  return '闷热';
}

export function getHeatBgColor(score: number): string {
  if (score <= -60) return '#3B82F6';
  if (score <= -20) return '#38BDF8';
  if (score <= 20) return '#10B981';
  if (score <= 60) return '#FBBF24';
  return '#EF4444';
}

export function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

export function getTimeSlotLabel(slot: string): string {
  switch (slot) {
    case 'morning': return '早高峰';
    case 'evening': return '晚高峰';
    case 'offpeak': return '平峰';
    case 'all': return '全天';
    default: return slot;
  }
}
