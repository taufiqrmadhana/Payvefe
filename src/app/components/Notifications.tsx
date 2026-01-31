'use client';

import { Bell, CheckCircle, AlertTriangle, AlertCircle, User, DollarSign, X, Loader2, RefreshCw, Clock } from 'lucide-react';
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

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

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
    if (date >= todayStart) today.push(n);
    else if (date >= yesterdayStart) yesterday.push(n);
    else if (date >= weekStart) lastWeek.push(n);
    else older.push(n);
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
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => {
      switch (filter) {
        case 'payroll': return ['payroll_executed', 'payment_received', 'deposit_received'].includes(n.notification_type);
        case 'system': return ['system', 'contract_expiring'].includes(n.notification_type);
        case 'team': return ['invite_created', 'invite_claimed'].includes(n.notification_type);
        default: return true;
      }
    });
  }, [notifications, filter]);

  const grouped = useMemo(() => groupNotificationsByDate(filteredNotifications), [filteredNotifications]);

  const getIcon = (type: NotificationDisplayType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'info': return <User className="w-5 h-5 text-blue-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getDotColor = (type: NotificationDisplayType) => {
    switch (type) {
      case 'success': return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
      case 'warning': return 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
      case 'info': return 'bg-blue-500 shadow-[0_0_8px_#3b82f6]';
      case 'error': return 'bg-red-500 shadow-[0_0_8px_#ef4444]';
    }
  };

  const renderNotificationList = (notifs: Notification[], title: string) => {
    if (notifs.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{title}</h3>
        <div className="bg-white/[0.02] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {notifs.map((notif) => {
              const displayType = getDisplayType(notif.notification_type);
              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  className={`group relative px-6 py-5 transition-all cursor-pointer ${
                    !notif.is_read ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex gap-5 relative z-10">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5 bg-black/40 group-hover:scale-105 transition-transform`}>
                      {getIcon(displayType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <p className={`text-sm tracking-tight ${!notif.is_read ? 'font-bold text-white' : 'font-medium text-slate-400'}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{formatRelativeTime(notif.created_at)}</p>
                           {!notif.is_read && (
                             <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(displayType)} animate-pulse`} />
                           )}
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${!notif.is_read ? 'text-slate-300' : 'text-slate-500'}`}>{notif.message}</p>
                    </div>
                  </div>
                  {!notif.is_read && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Sidebar currentPage="notifications-full" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto relative">
        {/* BACKGROUND AURAS */}
        <div className="fixed top-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

        <CompanyHeader
          title="Inbox"
          subtitle="Real-time Event Logs"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
          showNotifications={false}
        >
          <div className="flex items-center gap-2">
            <button onClick={() => refresh()} className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
              <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Button
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loading}
              variant="outline"
              className="h-10 px-4 rounded-xl border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-20 transition-all"
            >
              Clear Unread
            </Button>
          </div>
        </CompanyHeader>

        <div className="p-6 sm:p-10 relative z-10 max-w-5xl mx-auto space-y-8">
          
          {/* CATEGORY FILTER BAR */}
          <div className="flex bg-white/[0.02] backdrop-blur-xl p-1 rounded-2xl border border-white/5 w-fit shadow-xl">
            {(['all', 'payroll', 'system', 'team'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* LIST CONTENT */}
          <div className="space-y-12 pb-20">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500/50" />
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Accessing Event Stream...</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-12 text-center shadow-xl">
                <AlertCircle className="w-12 h-12 text-red-500/50 mx-auto mb-4" />
                <p className="text-sm font-bold text-white uppercase tracking-tight">Sync Protocol Interrupted</p>
                <p className="text-xs text-slate-500 mt-2 mb-6">{error.message}</p>
                <Button onClick={() => refresh()} variant="outline" className="h-10 px-6 rounded-xl border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">Re-establish Connection</Button>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5 p-20 text-center">
                <Bell className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational Log Empty</p>
              </div>
            ) : (
              <div className="space-y-10">
                {renderNotificationList(grouped.today, 'Immediate Records')}
                {renderNotificationList(grouped.yesterday, 'Previous 24 Hours')}
                {renderNotificationList(grouped.lastWeek, 'Historical Interval')}
                {renderNotificationList(grouped.older, 'Archived Archive')}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// SUB-DATA COMPONENT
function MiniData({ label, val, color }: { label: string, val: string, color: string }) {
  return (
    <div>
      <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className={`text-xs font-bold ${color}`}>{val}</p>
    </div>
  );
}