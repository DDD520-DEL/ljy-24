import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { CloudSun, Droplets, Wind, RefreshCw, MapPin } from 'lucide-react';

export default function WeatherWidget() {
  const { weather, weatherLoading, fetchWeather } = useAppStore();

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (!weather && !weatherLoading) return null;

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-metro-card/60 border border-metro-border backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-slate-300">
        <MapPin className="w-3.5 h-3.5 text-metro-lightBlue" />
        <span className="text-xs font-medium">{weather?.city || '...'}</span>
      </div>

      {weatherLoading && !weather ? (
        <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
      ) : weather ? (
        <>
          <div className="w-px h-4 bg-metro-border" />

          <div className="flex items-center gap-1">
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">{weather.description}</span>
          </div>

          <div className="w-px h-4 bg-metro-border" />

          <div className="flex items-center gap-1">
            <span className={`text-sm font-bold font-display ${
              weather.temperature > 30
                ? 'bg-gradient-to-r from-orange-500 to-red-400 bg-clip-text text-transparent'
                : weather.temperature < 5
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-metro-blue to-metro-lightBlue bg-clip-text text-transparent'
            }`}>
              {weather.temperature}°C
            </span>
            <span className="text-[10px] text-slate-500">室外</span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-slate-400">{weather.humidity}%</span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <Wind className="w-3 h-3 text-teal-400" />
            <span className="text-[10px] text-slate-400">{weather.windSpeed}m/s</span>
          </div>

          <button
            onClick={fetchWeather}
            className="ml-0.5 p-1 rounded-md text-slate-500 hover:text-metro-lightBlue hover:bg-metro-blue/10 transition-all"
            aria-label="刷新天气"
          >
            <RefreshCw className={`w-3 h-3 ${weatherLoading ? 'animate-spin' : ''}`} />
          </button>
        </>
      ) : null}
    </div>
  );
}
