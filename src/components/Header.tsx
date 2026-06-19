import { Link, useLocation } from 'react-router-dom';
import { ThermometerSun, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export default function Header() {
  const location = useLocation();
  const { anomalies, dismissedAnomalyIds } = useAppStore();
  const activeAnomalies = anomalies.filter(a => !dismissedAnomalyIds.has(a.id));
  const bannerHeight = activeAnomalies.length * 88;

  return (
    <header
      className="sticky z-50 bg-metro-darker/90 backdrop-blur-md border-b border-metro-border"
      style={{ top: `${bannerHeight}px` }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metro-blue to-metro-lightBlue flex items-center justify-center shadow-lg shadow-metro-blue/30 group-hover:scale-105 transition-transform">
            <ThermometerSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white tracking-tight">地铁温度计</h1>
            <p className="text-xs text-slate-400 -mt-0.5">Metro Temp Vote</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/'
                ? 'bg-metro-blue/20 text-metro-lightBlue'
                : 'text-slate-400 hover:text-white hover:bg-metro-card/50'
            }`}
          >
            <ThermometerSun className="w-4 h-4" />
            <span>投票</span>
          </Link>
          <Link
            to="/heatmap"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/heatmap'
                ? 'bg-metro-blue/20 text-metro-lightBlue'
                : 'text-slate-400 hover:text-white hover:bg-metro-card/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>热力图</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
