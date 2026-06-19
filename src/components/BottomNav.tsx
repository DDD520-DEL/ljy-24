import { Link, useLocation } from 'react-router-dom';
import { ThermometerSun, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      icon: ThermometerSun,
      label: '投票',
    },
    {
      to: '/heatmap',
      icon: BarChart3,
      label: '热力图',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-metro-darker/95 backdrop-blur-md border-t border-metro-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-all',
                active
                  ? 'text-metro-lightBlue'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 mb-1 transition-transform',
                  active && 'scale-110'
                )}
              />
              <span className={cn(
                'text-xs font-medium',
                active && 'text-metro-lightBlue'
              )}>
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 w-12 h-0.5 bg-metro-lightBlue rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
