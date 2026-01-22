import { Bell, CheckCircle, AlertTriangle, AlertCircle, User, DollarSign, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { useState, useEffect } from 'react';

interface NotificationsProps {
  onNavigate: (page: string) => void;
}

type NotificationType = 'success' | 'warning' | 'info' | 'error';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Payroll executed successfully',
    description: '75 employees paid $29,160',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Balance running low',
    description: 'Add funds before next payroll (Feb 25)',
    time: '1 day ago',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: '7 employee contracts expiring soon',
    description: 'Review contracts before Feb 28',
    time: '3 days ago',
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'Anderson Smith accepted invitation',
    description: 'New employee onboarded',
    time: '5 days ago',
    read: true
  },
  {
    id: 5,
    type: 'success',
    title: 'Withdrawal completed',
    description: '$215 sent to BCA account',
    time: '1 hour ago',
    read: false
  }
];

export function Notifications({ onNavigate }: NotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'payroll' | 'system' | 'team'>('all');
  const [notifList, setNotifList] = useState(notifications);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const markAllRead = () => {
    setNotifList(notifList.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationType) => {
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

  const getDotColor = (type: NotificationType) => {
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

  const getBgColor = (type: NotificationType) => {
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

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      <Sidebar currentPage="notifications-full" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto">
        <CompanyHeader 
          title="Notifications"
          subtitle="Stay updated on important events"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
          showNotifications={false}
        >
          <Button 
            onClick={markAllRead}
            variant="outline" 
            className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl border-white/20 text-white hover:bg-white/10 bg-slate-800/50 backdrop-blur-sm text-sm sm:text-base"
          >
            Mark all as read
          </Button>
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
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${
                    filter === f
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Notifications by Date */}
            <div className="space-y-6 sm:space-y-8">
              {/* Today */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Today</h3>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 divide-y divide-white/5">
                  {notifList.slice(0, 2).map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 sm:px-6 py-4 hover:bg-slate-700/30 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className={`text-sm ${!notif.read ? 'font-semibold text-white' : 'text-slate-300'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <div className={`w-2 h-2 rounded-full ${getDotColor(notif.type)} animate-pulse ml-2 flex-shrink-0`}></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-1">{notif.description}</p>
                          <p className="text-xs text-slate-500">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yesterday */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Yesterday</h3>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 divide-y divide-white/5">
                  {notifList.slice(2, 3).map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 sm:px-6 py-4 hover:bg-slate-700/30 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className={`text-sm ${!notif.read ? 'font-semibold text-white' : 'text-slate-300'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <div className={`w-2 h-2 rounded-full ${getDotColor(notif.type)} animate-pulse ml-2 flex-shrink-0`}></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-1">{notif.description}</p>
                          <p className="text-xs text-slate-500">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last 7 Days */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Last 7 Days</h3>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 divide-y divide-white/5">
                  {notifList.slice(3).map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 sm:px-6 py-4 hover:bg-slate-700/30 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className={`text-sm ${!notif.read ? 'font-semibold text-white' : 'text-slate-300'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <div className={`w-2 h-2 rounded-full ${getDotColor(notif.type)} animate-pulse ml-2 flex-shrink-0`}></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-1">{notif.description}</p>
                          <p className="text-xs text-slate-500">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
