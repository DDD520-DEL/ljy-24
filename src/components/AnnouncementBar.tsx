import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import {
  ChevronUp,
  ChevronDown,
  X,
  Megaphone,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Info,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { Announcement, AnnouncementType } from '../../shared/types.js';

const CAROUSEL_INTERVAL = 5000;
const STORAGE_KEY_CURRENT_INDEX = 'metro_announcement_index';
const STORAGE_KEY_COLLAPSED = 'metro_announcement_collapsed';
const STORAGE_KEY_DISMISSED = 'metro_announcement_dismissed';

function getTypeConfig(type: AnnouncementType) {
  switch (type) {
    case 'maintenance':
      return {
        icon: Wrench,
        bgClass: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700',
        borderClass: 'border-slate-500/30',
        iconBg: 'bg-white/20',
        badgeBg: 'bg-slate-900/50',
        badgeText: 'text-slate-100',
        label: '系统维护',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bgClass: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600',
        borderClass: 'border-amber-400/30',
        iconBg: 'bg-white/20',
        badgeBg: 'bg-amber-900/50',
        badgeText: 'text-amber-100',
        label: '提醒',
      };
    case 'success':
      return {
        icon: CheckCircle,
        bgClass: 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600',
        borderClass: 'border-emerald-400/30',
        iconBg: 'bg-white/20',
        badgeBg: 'bg-emerald-900/50',
        badgeText: 'text-emerald-100',
        label: '新功能',
      };
    case 'info':
    default:
      return {
        icon: Info,
        bgClass: 'bg-gradient-to-r from-metro-blue via-metro-lightBlue to-metro-blue',
        borderClass: 'border-metro-lightBlue/30',
        iconBg: 'bg-white/20',
        badgeBg: 'bg-blue-900/50',
        badgeText: 'text-blue-100',
        label: '公告',
      };
  }
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
}

function getStoredCurrentIndex(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT_INDEX);
    if (stored) {
      const idx = parseInt(stored, 10);
      if (!isNaN(idx) && idx >= 0) {
        return idx;
      }
    }
  } catch {
    // ignore
  }
  return 0;
}

function isInternalLink(link: string): boolean {
  return link.startsWith('/') && !link.startsWith('//');
}

interface AnnouncementLinkProps {
  href: string;
  text: string;
}

function AnnouncementLink({ href, text }: AnnouncementLinkProps) {
  if (isInternalLink(href)) {
    return (
      <Link
        to={href}
        className="inline-flex items-center gap-1 ml-2 text-white font-semibold underline underline-offset-2 hover:no-underline transition-all"
      >
        {text}
        <ExternalLink className="w-3 h-3" />
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 ml-2 text-white font-semibold underline underline-offset-2 hover:no-underline transition-all"
    >
      {text}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}

interface AnnouncementItemProps {
  announcement: Announcement;
  onDismiss: () => void;
}

function AnnouncementItem({ announcement, onDismiss }: AnnouncementItemProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = getTypeConfig(announcement.type);
  const Icon = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative overflow-hidden ${config.bgClass} border-b ${config.borderClass} shadow-lg transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />

      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 ${config.iconBg} rounded-xl backdrop-blur-sm`}>
            <div className="text-white animate-pulse-slow">
              <Icon className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Megaphone className="w-4 h-4 text-white/90 flex-shrink-0" />
              <span className="text-white font-bold text-sm">
                {announcement.title}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.badgeBg} ${config.badgeText}`}>
                {config.label}
              </span>
              <span className="text-white/60 text-xs">
                {formatDate(announcement.createdAt)}
              </span>
            </div>

            <p className="text-white/95 text-sm mb-2 leading-relaxed">
              {announcement.content}
              {announcement.link && announcement.linkText && (
                <AnnouncementLink
                  href={announcement.link}
                  text={announcement.linkText}
                />
              )}
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="关闭公告"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementBar() {
  const {
    announcements,
    announcementsLoading,
    announcementsCollapsed,
    dismissedAnnouncementIds,
    fetchAnnouncements,
    toggleAnnouncementsCollapsed,
    dismissAnnouncement,
  } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState<number>(getStoredCurrentIndex);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  const activeAnnouncements = announcements.filter(
    (a) => !dismissedAnnouncementIds.has(a.id)
  );

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev <= 0 ? activeAnnouncements.length - 1 : prev - 1;
      try {
        localStorage.setItem(STORAGE_KEY_CURRENT_INDEX, String(newIndex));
      } catch {
        // ignore
      }
      return newIndex;
    });
  }, [activeAnnouncements.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev >= activeAnnouncements.length - 1 ? 0 : prev + 1;
      try {
        localStorage.setItem(STORAGE_KEY_CURRENT_INDEX, String(newIndex));
      } catch {
        // ignore
      }
      return newIndex;
    });
  }, [activeAnnouncements.length]);

  const handleSetIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_INDEX, String(index));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (activeAnnouncements.length <= 1 || announcementsCollapsed) return;
    const timer = setInterval(goToNext, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [activeAnnouncements.length, announcementsCollapsed, goToNext]);

  useEffect(() => {
    if (currentIndex >= activeAnnouncements.length) {
      setCurrentIndex(0);
    }
  }, [activeAnnouncements.length, currentIndex]);

  if (announcementsLoading && activeAnnouncements.length === 0) return null;
  if (activeAnnouncements.length === 0) return null;

  const currentAnnouncement = activeAnnouncements[currentIndex];

  return (
    <div className="fixed top-0 left-0 right-0 z-[90]">
      {!announcementsCollapsed && currentAnnouncement && (
        <>
          <AnnouncementItem
            key={currentAnnouncement.id}
            announcement={currentAnnouncement}
            onDismiss={() => dismissAnnouncement(currentAnnouncement.id)}
          />

          {activeAnnouncements.length > 1 && (
            <div className="relative bg-metro-darker/90 backdrop-blur-sm border-b border-metro-border/50">
              <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3">
                <button
                  onClick={goToPrev}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-metro-card/50 transition-all"
                  aria-label="上一条公告"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {activeAnnouncements.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSetIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'bg-metro-lightBlue w-4'
                          : 'bg-slate-500 hover:bg-slate-400'
                      }`}
                      aria-label={`切换到第${idx + 1}条公告`}
                    />
                  ))}
                </div>

                <span className="text-xs text-slate-400 ml-1">
                  {currentIndex + 1} / {activeAnnouncements.length}
                </span>

                <button
                  onClick={goToNext}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-metro-card/50 transition-all"
                  aria-label="下一条公告"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-metro-darker/90 backdrop-blur-md border-b border-metro-border/50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Megaphone className="w-3.5 h-3.5" />
            <span>
              {announcementsCollapsed
                ? `${activeAnnouncements.length} 条公告已折叠`
                : activeAnnouncements.length > 1
                ? `共 ${activeAnnouncements.length} 条系统公告，每 5 秒自动轮播`
                : '系统公告'}
            </span>
          </div>
          <button
            onClick={toggleAnnouncementsCollapsed}
            className="flex items-center gap-1 px-3 py-1 rounded-md text-xs text-slate-400 hover:text-white hover:bg-metro-card/50 transition-all"
          >
            {announcementsCollapsed ? (
              <>
                <span>展开</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>折叠</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
