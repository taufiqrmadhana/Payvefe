import { Bell, CheckCircle, AlertTriangle, AlertCircle, User, DollarSign, X, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useNotifications } from '@/hooks/useApi';
import type { Notification } from '@/services/notificationService';

interface NotificationsProps {
  onNavigate: (page: string) => void;
}

type NotificationDisplayType = 'success' | 'warning' | 'info' | 'error';

// Map backend notification types to display types
const getDisplayType = (type: string): NotificationDisplayType => {
  switch (type) {
    case 'payroll_executed':
    case 'payment_received':
    case 'withdraw_success':
    case 'deposit_received':
      return 'success';
    case 'contract_expiring':
      return 'warning';
    case 'invite_created':
    case 'invite_claimed':
      return 'info';
    default:
      return 'info';
  }
};

// Format date to relative time
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

// Group notifications by date
const groupNotificationsByDate = (notifications: Notification[]) => {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const lastWeek: Notification[] = [];
  const older: Notification[] = [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 7 * 86400000);

  notifications.forEach((n) => {
    const date = new Date(n.created_at);
    if (date >= todayStart) {
      today.push(n);
    } else if (date >= yesterdayStart) {
      yesterday.push(n);
    } else if (date >= weekStart) {
      lastWeek.push(n);
    } else {
      older.push(n);
    }
  });

  return { today, yesterday, lastWeek, older };
};

export function Notifications({ onNavigate }: NotificationsProps) {
  const { address } = useAccount();
  const [filter, setFilter] = useState<'all' | 'payroll' | 'system' | 'team'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markAsRead,
    markAllAsRead
  } = useNotifications(address);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter notifications based on selected filter
  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;

    return notifications.filter(n => {
      switch (filter) {
        case 'payroll':
          return ['payroll_executed', 'payment_received', 'deposit_received'].includes(n.notification_type);
        case 'system':
          return ['system', 'contract_expiring'].includes(n.notification_type);
        case 'team':
          return ['invite_created', 'invite_claimed'].includes(n.notification_type);
        default:
          return true;
      }
    });
  }, [notifications, filter]);

  // Group filtered notifications
  const grouped = useMemo(() => groupNotificationsByDate(filteredNotifications), [filteredNotifications]);

  const getIcon = (type: NotificationDisplayType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'info':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getDotColor = (type: NotificationDisplayType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  const getBgColor = (type: NotificationDisplayType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10';
      case 'warning':
        return 'bg-amber-500/10';
      case 'info':
        return 'bg-blue-500/10';
      case 'error':
        return 'bg-red-500/10';
    }
  };

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
  };

  const renderNotificationList = (notifications: Notification[], title: string) => {
    if (notifications.length === 0) return null;

    return (
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</h3>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 divide-y divide-white/5">
          {notifications.map((notif) => {
            const displayType = getDisplayType(notif.notification_type);
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className="px-4 sm:px-6 py-4 hover:bg-slate-700/30 cursor-pointer transition-colors"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(displayType)}`}>
                    {getIcon(displayType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-sm ${!notif.is_read ? 'font-semibold text-white' : 'text-slate-300'}`}>
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <div className={`w-2 h-2 rounded-full ${getDotColor(displayType)} animate-pulse ml-2 flex-shrink-0`}></div>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-1">{notif.message}</p>
                    <p className="text-xs text-slate-500">{formatRelativeTime(notif.created_at)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      <Sidebar currentPage="notifications-full" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto">
        <CompanyHeader
          title="Notifications"
          subtitle={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Stay updated on important events'}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
          showNotifications={false}
        >
          <div className="flex gap-2">
            <Button
              onClick={() => refresh()}
              variant="outline"
              size="icon"
              className="h-10 sm:h-11 w-10 sm:w-11 rounded-xl border-white/20 text-white hover:bg-white/10 bg-slate-800/50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl border-white/20 text-white hover:bg-white/10 bg-slate-800/50 backdrop-blur-sm text-sm sm:text-base"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
        </CompanyHeader>

        {/* Content Area */}
        <div className="p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto bg-slate-800/50 p-1 rounded-xl border border-white/10">
              {(['all', 'payroll', 'system', 'team'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${filter === f
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && notifications.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-white font-medium">Failed to load notifications</p>
                <p className="text-slate-400 text-sm mt-1">{error.message}</p>
                <Button onClick={() => refresh()} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredNotifications.length === 0 && (
              <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-12 text-center">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-white font-medium">No notifications</p>
                <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
              </div>
            )}

            {/* Notifications by Date */}
            {!loading && !error && filteredNotifications.length > 0 && (
              <div className="space-y-6 sm:space-y-8">
                {renderNotificationList(grouped.today, 'Today')}
                {renderNotificationList(grouped.yesterday, 'Yesterday')}
                {renderNotificationList(grouped.lastWeek, 'Last 7 Days')}
                {renderNotificationList(grouped.older, 'Older')}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
