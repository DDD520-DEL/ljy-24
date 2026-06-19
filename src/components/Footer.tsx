import { Link } from 'react-router-dom';
import { MessageSquare, ThermometerSun } from 'lucide-react';

const APP_NAME = '地铁温度计';
const APP_VERSION = 'v1.0.0';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-metro-border/50 bg-metro-darker/40 animate-fade-in">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-metro-blue to-metro-lightBlue flex items-center justify-center shadow-md shadow-metro-blue/20">
              <ThermometerSun className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-semibold text-sm text-slate-300">{APP_NAME}</span>
              <span className="ml-2 text-xs text-slate-500 font-mono">{APP_VERSION}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            数据来源于用户匿名投票，仅供参考
          </p>

          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-metro-lightBlue hover:bg-metro-blue/10 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            意见反馈
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-metro-border/30 text-center">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} {APP_NAME} · 让通勤更舒适
          </p>
        </div>
      </div>
    </footer>
  );
}
