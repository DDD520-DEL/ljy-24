import { Router, type Request, type Response } from 'express';
import type { WeatherData } from '../../shared/types.js';

const router = Router();

const WEATHER_CONDITIONS = [
  { description: '晴', humidityRange: [20, 40], windRange: [1, 3] },
  { description: '多云', humidityRange: [40, 60], windRange: [2, 5] },
  { description: '阴', humidityRange: [50, 70], windRange: [2, 6] },
  { description: '小雨', humidityRange: [70, 90], windRange: [3, 7] },
  { description: '大雨', humidityRange: [85, 98], windRange: [5, 10] },
  { description: '雪', humidityRange: [60, 80], windRange: [2, 5] },
];

function getSeasonalBaseTemp(): number {
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) return 18;
  if (month >= 6 && month <= 8) return 30;
  if (month >= 9 && month <= 11) return 15;
  return -2;
}

function generateMockWeather(): WeatherData {
  const now = new Date();
  const hour = now.getHours();
  const baseTemp = getSeasonalBaseTemp();
  const hourOffset = hour >= 6 && hour <= 14
    ? (hour - 6) * 1.2
    : hour > 14
      ? -(hour - 14) * 0.8
      : -3;
  const randomOffset = (Math.random() - 0.5) * 6;
  const temperature = Math.round((baseTemp + hourOffset + randomOffset) * 10) / 10;

  const condition = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];
  const humidity = condition.humidityRange[0] + Math.floor(
    Math.random() * (condition.humidityRange[1] - condition.humidityRange[0])
  );
  const windSpeed = Math.round(
    (condition.windRange[0] + Math.random() * (condition.windRange[1] - condition.windRange[0])) * 10
  ) / 10;

  return {
    city: '北京',
    temperature,
    description: condition.description,
    humidity,
    windSpeed,
    updatedAt: Date.now(),
  };
}

router.get('/', (_req: Request, res: Response) => {
  const weather = generateMockWeather();
  res.json({ success: true, data: weather });
});

export default router;
