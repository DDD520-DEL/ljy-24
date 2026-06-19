import type { MetroLine, Vote, VoteLevel, TimeSlot, FavoriteLine, Feedback, FeedbackCountMap, MetroStation, StationSection, UserImpactStats, CarriageViewRecord, TransferLine } from '../../shared/types.js';

function generateStations(lineId: string, names: string[]): MetroStation[] {
  return names.map((name, index) => ({
    id: `${lineId}_stn_${index}`,
    name,
    index,
  }));
}

function generateSections(lineId: string, stations: MetroStation[]): StationSection[] {
  const total = stations.length;
  const third = Math.ceil(total / 3);
  return [
    {
      id: `${lineId}_sec_start`,
      name: '前段站点',
      stationIndices: stations.slice(0, third).map((s) => s.index),
    },
    {
      id: `${lineId}_sec_mid`,
      name: '中段站点',
      stationIndices: stations.slice(third, third * 2).map((s) => s.index),
    },
    {
      id: `${lineId}_sec_end`,
      name: '末段站点',
      stationIndices: stations.slice(third * 2).map((s) => s.index),
    },
  ];
}

const LINE1_STATIONS = generateStations('line1', [
  '苹果园', '古城', '八角游乐园', '八宝山', '玉泉路',
  '五棵松', '万寿路', '公主坟', '军事博物馆', '木樨地',
  '南礼士路', '复兴门', '西单', '天安门西', '天安门东',
  '王府井', '东单', '建国门', '永安里', '国贸',
  '大望路', '四惠', '四惠东',
]);

const LINE2_STATIONS = generateStations('line2', [
  '西直门', '车公庄', '阜成门', '复兴门', '长椿街',
  '宣武门', '和平门', '前门', '崇文门', '北京站',
  '建国门', '朝阳门', '东四十条', '东直门', '雍和宫',
  '安定门', '鼓楼大街', '积水潭',
]);

const LINE5_STATIONS = generateStations('line5', [
  '天通苑北', '天通苑', '天通苑南', '立水桥', '北苑路北',
  '大屯路东', '惠新西街北口', '惠新西街南口', '和平西桥', '和平里北街',
  '雍和宫', '北新桥', '张自忠路', '东四', '灯市口',
  '东单', '崇文门', '磁器口', '天坛东门', '蒲黄榆',
  '刘家窑', '宋家庄',
]);

const LINE10_STATIONS = generateStations('line10', [
  '巴沟', '苏州街', '海淀黄庄', '知春里', '知春路',
  '西土城', '牡丹园', '健德门', '北土城', '安贞门',
  '惠新西街南口', '芍药居', '太阳宫', '三元桥', '亮马桥',
  '农业展览馆', '团结湖', '呼家楼', '金台夕照', '国贸',
  '双井', '劲松', '潘家园', '十里河', '分钟寺',
  '成寿寺', '宋家庄', '石榴庄', '大红门', '角门东',
  '角门西', '草桥', '纪家庙', '首经贸', '丰台站',
  '泥洼', '西局', '六里桥', '莲花桥', '公主坟',
  '西钓鱼台', '慈寿寺', '车道沟', '长春桥', '火器营',
]);

const LINE13_STATIONS = generateStations('line13', [
  '西直门', '大钟寺', '五道口', '上地', '西二旗',
  '龙泽', '回龙观', '霍营', '立水桥', '北苑',
  '望京西', '芍药居', '光熙门', '柳芳', '东直门',
]);

const LINE14_STATIONS = generateStations('line14', [
  '张郭庄', '园博园', '大瓦窑', '郭庄子', '大井',
  '七里庄', '西局', '东管头', '丽泽商务区', '菜户营',
  '西铁营', '景风门', '北京南站', '陶然桥', '永定门外',
  '景泰', '蒲黄榆', '方庄', '十里河', '北工大西门',
  '平乐园', '九龙山', '大望路', '红庙', '金台路',
  '朝阳公园', '枣营', '东风北桥', '将台', '高家园',
  '望京南', '阜通', '望京', '东湖渠', '来广营',
  '善各庄',
]);

const LINE_COLORS: Record<string, { id: string; name: string; color: string }> = {
  line1: { id: 'line1', name: '1号线', color: '#C23A30' },
  line2: { id: 'line2', name: '2号线', color: '#006098' },
  line5: { id: 'line5', name: '5号线', color: '#A6217E' },
  line10: { id: 'line10', name: '10号线', color: '#0090A3' },
  line13: { id: 'line13', name: '13号线', color: '#F3D03E' },
  line14: { id: 'line14', name: '14号线', color: '#D4A455' },
};

function buildTransfer(lineId: string, stations: string[]): TransferLine {
  const line = LINE_COLORS[lineId];
  return {
    lineId: line.id,
    lineName: line.name,
    lineColor: line.color,
    stations,
  };
}

const LINE1_TRANSFERS: TransferLine[] = [
  buildTransfer('line2', ['复兴门', '建国门']),
  buildTransfer('line5', ['东单']),
  buildTransfer('line10', ['公主坟', '国贸']),
  buildTransfer('line14', ['大望路']),
];

const LINE2_TRANSFERS: TransferLine[] = [
  buildTransfer('line1', ['复兴门', '建国门']),
  buildTransfer('line5', ['雍和宫', '崇文门']),
  buildTransfer('line13', ['西直门', '东直门']),
];

const LINE5_TRANSFERS: TransferLine[] = [
  buildTransfer('line1', ['东单']),
  buildTransfer('line2', ['雍和宫', '崇文门']),
  buildTransfer('line10', ['惠新西街南口', '宋家庄']),
  buildTransfer('line13', ['立水桥']),
  buildTransfer('line14', ['蒲黄榆']),
];

const LINE10_TRANSFERS: TransferLine[] = [
  buildTransfer('line1', ['公主坟', '国贸']),
  buildTransfer('line5', ['惠新西街南口', '宋家庄']),
  buildTransfer('line13', ['芍药居']),
  buildTransfer('line14', ['西局', '十里河']),
];

const LINE13_TRANSFERS: TransferLine[] = [
  buildTransfer('line2', ['西直门', '东直门']),
  buildTransfer('line5', ['立水桥']),
  buildTransfer('line10', ['芍药居']),
];

const LINE14_TRANSFERS: TransferLine[] = [
  buildTransfer('line1', ['大望路']),
  buildTransfer('line5', ['蒲黄榆']),
  buildTransfer('line10', ['西局', '十里河']),
];

const LINES: MetroLine[] = [
  { id: 'line1', name: '1号线', color: '#C23A30', carriageCount: 6, stations: LINE1_STATIONS, stationSections: generateSections('line1', LINE1_STATIONS), timetable: { firstTrain: '05:10', lastTrain: '23:15', firstTrainWeekend: '05:20', lastTrainWeekend: '23:15' }, transferLines: LINE1_TRANSFERS },
  { id: 'line2', name: '2号线', color: '#006098', carriageCount: 6, stations: LINE2_STATIONS, stationSections: generateSections('line2', LINE2_STATIONS), timetable: { firstTrain: '05:03', lastTrain: '23:44', firstTrainWeekend: '05:10', lastTrainWeekend: '23:44' }, transferLines: LINE2_TRANSFERS },
  { id: 'line5', name: '5号线', color: '#A6217E', carriageCount: 6, stations: LINE5_STATIONS, stationSections: generateSections('line5', LINE5_STATIONS), timetable: { firstTrain: '05:19', lastTrain: '23:10', firstTrainWeekend: '05:30', lastTrainWeekend: '23:10' }, transferLines: LINE5_TRANSFERS },
  { id: 'line10', name: '10号线', color: '#0090A3', carriageCount: 8, stations: LINE10_STATIONS, stationSections: generateSections('line10', LINE10_STATIONS), timetable: { firstTrain: '04:54', lastTrain: '22:27', firstTrainWeekend: '05:10', lastTrainWeekend: '22:27' }, transferLines: LINE10_TRANSFERS },
  { id: 'line13', name: '13号线', color: '#F3D03E', carriageCount: 6, stations: LINE13_STATIONS, stationSections: generateSections('line13', LINE13_STATIONS), timetable: { firstTrain: '05:35', lastTrain: '22:42', firstTrainWeekend: '05:50', lastTrainWeekend: '22:42' }, transferLines: LINE13_TRANSFERS },
  { id: 'line14', name: '14号线', color: '#D4A455', carriageCount: 6, stations: LINE14_STATIONS, stationSections: generateSections('line14', LINE14_STATIONS), timetable: { firstTrain: '05:00', lastTrain: '22:30', firstTrainWeekend: '05:15', lastTrainWeekend: '22:30' }, transferLines: LINE14_TRANSFERS },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function getTimeSlotFromHour(hour: number): TimeSlot {
  if (hour >= 7 && hour <= 9) return 'morning';
  if (hour >= 17 && hour <= 19) return 'evening';
  return 'offpeak';
}

function getRandomStationSection(line: MetroLine): string {
  const sections = line.stationSections;
  return sections[Math.floor(Math.random() * sections.length)].id;
}

function generateMockVotes(): Vote[] {
  const votes: Vote[] = [];
  const now = Date.now();

  for (let dayOffset = 0; dayOffset <= 8; dayOffset++) {
    const dayBase = now - dayOffset * 24 * 3600 * 1000;
    const dayMultiplier = dayOffset === 0 ? 1 : (dayOffset === 1 || dayOffset === 7 ? 0.85 : 0.6);

    for (const line of LINES) {
      const voteCount = Math.floor((80 + Math.floor(Math.random() * 120)) * dayMultiplier);
      for (let i = 0; i < voteCount; i++) {
        const randomHourOffset = Math.floor(Math.random() * 24);
        const timestamp = dayBase - randomHourOffset * 3600 * 1000 - Math.floor(Math.random() * 3600 * 1000);
        const date = new Date(timestamp);
        const hour = date.getHours();
        const timeSlot = getTimeSlotFromHour(hour);

        let level: VoteLevel;
        const rand = Math.random();
        if (rand < 0.3) {
          level = 'cold';
        } else if (rand < 0.75) {
          level = 'comfortable';
        } else {
          level = 'hot';
        }

        votes.push({
          id: generateId(),
          lineId: line.id,
          carriageNumber: 1 + Math.floor(Math.random() * line.carriageCount),
          level,
          timestamp,
          timeSlot,
          stationSectionId: getRandomStationSection(line),
        });
      }
    }
  }

  injectAnomalyTestData(votes, now);

  return votes;
}

function injectAnomalyTestData(votes: Vote[], now: number): void {
  const targetLine = 'line1';
  const targetCarriage = 3;
  const line1 = LINES.find((l) => l.id === targetLine)!;

  for (let i = 0; i < 30; i++) {
    const hourOffset = 1 + Math.floor(Math.random() * 23);
    const timestamp = now - hourOffset * 3600 * 1000 - Math.floor(Math.random() * 3600 * 1000);
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine,
      carriageNumber: targetCarriage,
      level: 'comfortable',
      timestamp,
      timeSlot,
      stationSectionId: getRandomStationSection(line1),
    });
  }

  for (let i = 0; i < 12; i++) {
    const minutesAgo = Math.floor(Math.random() * 25);
    const timestamp = now - minutesAgo * 60 * 1000;
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine,
      carriageNumber: targetCarriage,
      level: 'cold',
      timestamp,
      timeSlot,
      stationSectionId: getRandomStationSection(line1),
    });
  }

  const targetLine2 = 'line10';
  const targetCarriage2 = 5;
  const line10 = LINES.find((l) => l.id === targetLine2)!;

  for (let i = 0; i < 25; i++) {
    const hourOffset = 1 + Math.floor(Math.random() * 23);
    const timestamp = now - hourOffset * 3600 * 1000 - Math.floor(Math.random() * 3600 * 1000);
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine2,
      carriageNumber: targetCarriage2,
      level: 'comfortable',
      timestamp,
      timeSlot,
      stationSectionId: getRandomStationSection(line10),
    });
  }

  for (let i = 0; i < 10; i++) {
    const minutesAgo = Math.floor(Math.random() * 25);
    const timestamp = now - minutesAgo * 60 * 1000;
    const date = new Date(timestamp);
    const hour = date.getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    votes.push({
      id: generateId(),
      lineId: targetLine2,
      carriageNumber: targetCarriage2,
      level: 'hot',
      timestamp,
      timeSlot,
      stationSectionId: getRandomStationSection(line10),
    });
  }
}

function generateMockUserVotes(baseVotes: Vote[], lines: MetroLine[], userId: string): Vote[] {
  const userVotes: Vote[] = [];
  const now = Date.now();

  const voteTimes = [
    { daysAgo: 7, hour: 8, minute: 30 },
    { daysAgo: 6, hour: 18, minute: 15 },
    { daysAgo: 5, hour: 8, minute: 45 },
    { daysAgo: 4, hour: 12, minute: 20 },
    { daysAgo: 3, hour: 19, minute: 5 },
    { daysAgo: 2, hour: 7, minute: 55 },
    { daysAgo: 1, hour: 18, minute: 30 },
    { daysAgo: 0, hour: 9, minute: 10 },
    { daysAgo: 0, hour: 18, minute: 45 },
    { daysAgo: 0, hour: 14, minute: 20 },
  ];

  voteTimes.forEach((vt, idx) => {
    const line = lines[idx % lines.length];
    const carriage = 1 + (idx % line.carriageCount);
    const date = new Date(now);
    date.setDate(date.getDate() - vt.daysAgo);
    date.setHours(vt.hour, vt.minute, 0, 0);
    const timestamp = date.getTime();
    const timeSlot = getTimeSlotFromHour(vt.hour);
    const stationSectionId = getRandomStationSection(line);

    const levels: VoteLevel[] = ['cold', 'comfortable', 'hot'];
    const level = levels[idx % 3];

    const relevantVotes = baseVotes.filter(
      (v) => v.lineId === line.id && v.carriageNumber === carriage && v.timestamp <= timestamp
    );
    const coldCount = relevantVotes.filter((v) => v.level === 'cold').length;
    const comfortableCount = relevantVotes.filter((v) => v.level === 'comfortable').length;
    const hotCount = relevantVotes.filter((v) => v.level === 'hot').length;
    const totalCount = coldCount + comfortableCount + hotCount;
    const snapshotScore = totalCount > 0
      ? Math.round(((hotCount - coldCount) / totalCount) * 100)
      : 0;

    userVotes.push({
      id: generateId(),
      lineId: line.id,
      carriageNumber: carriage,
      level,
      timestamp,
      timeSlot,
      stationSectionId,
      userId,
      snapshotScore,
      snapshotColdCount: coldCount,
      snapshotComfortableCount: comfortableCount,
      snapshotHotCount: hotCount,
      snapshotTotalCount: totalCount,
    });
  });

  return userVotes;
}

const COLD_FEEDBACKS = [
  '空调太冷了，冻得直哆嗦',
  '建议调高温度，穿外套都冷',
  '风太大，吹得头疼',
  '温度太低，老人小孩受不了',
  '冷气太足，下车后温差大容易感冒',
  '出风口对着吹，膝盖疼',
  '像进了冰窖一样',
];

const COMFORTABLE_FEEDBACKS = [
  '温度刚刚好，很舒服',
  '这个温度非常舒适',
  '空调温度调得很合适',
  '体感不错，点赞',
  '温度宜人，乘车体验好',
  '不冷不热刚刚好',
  '完美的温度，继续保持',
];

const HOT_FEEDBACKS = [
  '太热了，闷得慌',
  '空调没开吗？好热',
  '人多又热，像蒸桑拿',
  '赶紧调低点温度吧',
  '汗流浃背，太难受了',
  '空气不流通，又闷又热',
  '温度太高，容易晕车',
];

function generateMockFeedbacks(votes: Vote[]): Feedback[] {
  const feedbacks: Feedback[] = [];
  const now = Date.now();

  for (const vote of votes) {
    if (Math.random() > 0.25) continue;

    const templates = vote.level === 'cold'
      ? COLD_FEEDBACKS
      : vote.level === 'comfortable'
      ? COMFORTABLE_FEEDBACKS
      : HOT_FEEDBACKS;

    const content = templates[Math.floor(Math.random() * templates.length)];

    feedbacks.push({
      id: generateId(),
      lineId: vote.lineId,
      carriageNumber: vote.carriageNumber,
      content,
      level: vote.level,
      timestamp: vote.timestamp,
      voteId: vote.id,
    });
  }

  for (let i = 0; i < 80; i++) {
    const line = LINES[Math.floor(Math.random() * LINES.length)];
    const carriage = 1 + Math.floor(Math.random() * line.carriageCount);
    const minutesAgo = Math.floor(Math.random() * 60 * 24 * 3);
    const timestamp = now - minutesAgo * 60 * 1000;

    let level: VoteLevel;
    const rand = Math.random();
    if (rand < 0.3) level = 'cold';
    else if (rand < 0.75) level = 'comfortable';
    else level = 'hot';

    const templates = level === 'cold'
      ? COLD_FEEDBACKS
      : level === 'comfortable'
      ? COMFORTABLE_FEEDBACKS
      : HOT_FEEDBACKS;
    const content = templates[Math.floor(Math.random() * templates.length)];

    feedbacks.push({
      id: generateId(),
      lineId: line.id,
      carriageNumber: carriage,
      content,
      level,
      timestamp,
    });
  }

  return feedbacks.sort((a, b) => b.timestamp - a.timestamp);
}

function generateMockCarriageViews(votes: Vote[], lines: MetroLine[]): CarriageViewRecord[] {
  const views: CarriageViewRecord[] = [];
  const now = Date.now();

  for (const vote of votes) {
    const viewCount = 3 + Math.floor(Math.random() * 15);
    for (let i = 0; i < viewCount; i++) {
      const minutesAfter = Math.floor(Math.random() * 60 * 24 * 5);
      const timestamp = vote.timestamp + minutesAfter * 60 * 1000;
      if (timestamp > now) continue;

      views.push({
        lineId: vote.lineId,
        carriageNumber: vote.carriageNumber,
        viewerUserId: Math.random() > 0.3 ? 'viewer_' + Math.random().toString(36).substring(2, 8) : undefined,
        timestamp,
      });
    }
  }

  for (let i = 0; i < 500; i++) {
    const line = lines[Math.floor(Math.random() * lines.length)];
    const carriage = 1 + Math.floor(Math.random() * line.carriageCount);
    const minutesAgo = Math.floor(Math.random() * 60 * 24 * 7);
    views.push({
      lineId: line.id,
      carriageNumber: carriage,
      viewerUserId: 'viewer_' + Math.random().toString(36).substring(2, 8),
      timestamp: now - minutesAgo * 60 * 1000,
    });
  }

  return views;
}

class DataStore {
  private votes: Vote[] = [];
  private feedbacks: Feedback[] = [];
  private favorites: Map<string, FavoriteLine[]> = new Map();
  private initializedUsers: Set<string> = new Set();
  private carriageViews: CarriageViewRecord[] = [];

  constructor() {
    const baseVotes = generateMockVotes();
    this.votes = [...baseVotes];
    this.feedbacks = generateMockFeedbacks(baseVotes);
    this.carriageViews = generateMockCarriageViews(baseVotes, LINES);
    this.ensureUserHistoryData('user_mock_history');
  }

  getLines(): MetroLine[] {
    return LINES;
  }

  getLineById(lineId: string): MetroLine | undefined {
    return LINES.find((l) => l.id === lineId);
  }

  getAllVotes(): Vote[] {
    return [...this.votes];
  }

  getVotesByLine(lineId: string, timeSlot?: TimeSlot): Vote[] {
    return this.votes.filter((v) => {
      if (v.lineId !== lineId) return false;
      if (timeSlot && timeSlot !== 'all' && v.timeSlot !== timeSlot) return false;
      return true;
    });
  }

  getVotesByLineAndDateRange(
    lineId: string,
    startOfDay: number,
    endOfDay: number,
    timeSlot?: TimeSlot,
  ): Vote[] {
    return this.votes.filter((v) => {
      if (v.lineId !== lineId) return false;
      if (v.timestamp < startOfDay || v.timestamp >= endOfDay) return false;
      if (timeSlot && timeSlot !== 'all' && v.timeSlot !== timeSlot) return false;
      return true;
    });
  }

  addVote(lineId: string, carriageNumber: number, level: VoteLevel, userId?: string, stationSectionId?: string): Vote {
    const now = Date.now();
    const hour = new Date(now).getHours();
    const timeSlot = getTimeSlotFromHour(hour);

    const priorVotes = this.votes.filter(
      (v) => v.lineId === lineId && v.carriageNumber === carriageNumber && v.timestamp <= now
    );
    const snapshotColdCount = priorVotes.filter((v) => v.level === 'cold').length;
    const snapshotComfortableCount = priorVotes.filter((v) => v.level === 'comfortable').length;
    const snapshotHotCount = priorVotes.filter((v) => v.level === 'hot').length;
    const snapshotTotalCount = snapshotColdCount + snapshotComfortableCount + snapshotHotCount;
    const snapshotScore = snapshotTotalCount > 0
      ? Math.round(((snapshotHotCount - snapshotColdCount) / snapshotTotalCount) * 100)
      : 0;

    const vote: Vote = {
      id: generateId(),
      lineId,
      carriageNumber,
      level,
      timestamp: now,
      timeSlot,
      stationSectionId,
      userId,
      snapshotScore,
      snapshotColdCount,
      snapshotComfortableCount,
      snapshotHotCount,
      snapshotTotalCount,
    };

    this.votes.push(vote);
    return vote;
  }

  getVotesByStationSection(lineId: string, sectionId: string, timeSlot?: TimeSlot): Vote[] {
    return this.votes.filter((v) => {
      if (v.lineId !== lineId) return false;
      if (v.stationSectionId !== sectionId) return false;
      if (timeSlot && timeSlot !== 'all' && v.timeSlot !== timeSlot) return false;
      return true;
    });
  }

  getStationSections(lineId: string): StationSection[] {
    const line = this.getLineById(lineId);
    return line?.stationSections || [];
  }

  getStations(lineId: string): MetroStation[] {
    const line = this.getLineById(lineId);
    return line?.stations || [];
  }

  ensureUserHistoryData(userId: string): void {
    if (this.initializedUsers.has(userId)) return;
    this.initializedUsers.add(userId);

    const existingCount = this.votes.filter((v) => v.userId === userId).length;
    if (existingCount > 0) return;

    const baseVotes = this.votes.filter((v) => !v.userId);
    const newUserVotes = generateMockUserVotes(baseVotes, LINES, userId);
    this.votes.push(...newUserVotes);
  }

  getUserVotes(userId: string, lineId?: string, timeSlot?: TimeSlot): Vote[] {
    return this.votes
      .filter((v) => {
        if (v.userId !== userId) return false;
        if (lineId && lineId !== 'all' && v.lineId !== lineId) return false;
        if (timeSlot && timeSlot !== 'all' && v.timeSlot !== timeSlot) return false;
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getFavorites(userId: string): FavoriteLine[] {
    return this.favorites.get(userId) || [];
  }

  isFavorite(userId: string, lineId: string): boolean {
    const userFavorites = this.favorites.get(userId) || [];
    return userFavorites.some((f) => f.lineId === lineId);
  }

  addFavorite(userId: string, lineId: string): FavoriteLine | null {
    if (!this.getLineById(lineId)) {
      return null;
    }
    if (this.isFavorite(userId, lineId)) {
      const userFavorites = this.favorites.get(userId) || [];
      return userFavorites.find((f) => f.lineId === lineId) || null;
    }
    const favorite: FavoriteLine = {
      id: generateId(),
      lineId,
      createdAt: Date.now(),
    };
    const userFavorites = this.favorites.get(userId) || [];
    userFavorites.push(favorite);
    this.favorites.set(userId, userFavorites);
    return favorite;
  }

  removeFavorite(userId: string, lineId: string): boolean {
    const userFavorites = this.favorites.get(userId) || [];
    const index = userFavorites.findIndex((f) => f.lineId === lineId);
    if (index === -1) {
      return false;
    }
    userFavorites.splice(index, 1);
    this.favorites.set(userId, userFavorites);
    return true;
  }

  addFeedback(
    lineId: string,
    carriageNumber: number,
    content: string,
    level: VoteLevel,
    userId?: string,
    voteId?: string,
  ): Feedback {
    const feedback: Feedback = {
      id: generateId(),
      lineId,
      carriageNumber,
      content: content.trim().slice(0, 50),
      level,
      timestamp: Date.now(),
      userId,
      voteId,
    };
    this.feedbacks.unshift(feedback);
    return feedback;
  }

  getFeedbacksByCarriage(lineId: string, carriageNumber: number, limit = 50): Feedback[] {
    return this.feedbacks
      .filter((f) => f.lineId === lineId && f.carriageNumber === carriageNumber)
      .slice(0, limit);
  }

  getFeedbackCountByCarriage(lineId: string, carriageNumber: number): number {
    return this.feedbacks.filter(
      (f) => f.lineId === lineId && f.carriageNumber === carriageNumber,
    ).length;
  }

  getFeedbackCountMap(lineId: string): FeedbackCountMap {
    const countMap: FeedbackCountMap = {};
    for (const f of this.feedbacks) {
      if (f.lineId !== lineId) continue;
      countMap[f.carriageNumber] = (countMap[f.carriageNumber] || 0) + 1;
    }
    return countMap;
  }

  addCarriageView(lineId: string, carriageNumber: number, viewerUserId?: string): void {
    this.carriageViews.push({
      lineId,
      carriageNumber,
      viewerUserId,
      timestamp: Date.now(),
    });
  }

  getUserImpactStats(userId: string): UserImpactStats {
    this.ensureUserHistoryData(userId);

    const userVotes = this.votes.filter((v) => v.userId === userId);
    const totalVotes = userVotes.length;

    const lineIds = new Set(userVotes.map((v) => v.lineId));
    const linesCovered = lineIds.size;

    const userVotedCarriages = new Set(
      userVotes.map((v) => `${v.lineId}_${v.carriageNumber}`),
    );

    let helpCount = 0;
    for (const view of this.carriageViews) {
      const key = `${view.lineId}_${view.carriageNumber}`;
      if (userVotedCarriages.has(key)) {
        if (view.viewerUserId && view.viewerUserId !== userId) {
          helpCount++;
        } else if (!view.viewerUserId) {
          helpCount++;
        }
      }
    }

    return {
      totalVotes,
      linesCovered,
      helpCount,
    };
  }
}

export const dataStore = new DataStore();
