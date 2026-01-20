import { Bell, CheckCircle, AlertTriangle, AlertCircle, User, DollarSign, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface NotificationsProps {
  onNavigate: (page: string) => void;
  view?: 'dropdown' | 'full';
  onClose?: () => void;
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

export function Notifications({ onNavigate, view = 'dropdown', onClose }: NotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'payroll' | 'system' | 'team'>('all');
  const [notifList, setNotifList] = useState(notifications);

  const markAllRead = () => {
    setNotifList(notifList.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'info':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getDotColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  // Dropdown View
  if (view === 'dropdown') {
    return (
      <div className="absolute top-14 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllRead}
              className="text-xs text-indigo-600 hover:underline"
            >
              Mark all read
            </button>
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifList.slice(0, 5).map((notif) => (
            <button
              key={notif.id}
              onClick={() => onNavigate('hr-dashboard')}
              className="w-full px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors"
            >
              <div className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? getDotColor(notif.type) : 'bg-gray-300'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm mb-1 ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">{notif.description}</p>
                  <p className="text-xs text-gray-500">{notif.time}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button 
            onClick={() => onNavigate('notifications-full')}
            className="text-sm text-indigo-600 hover:underline w-full text-center"
          >
            View All Notifications
          </button>
        </div>
      </div>
    );
  }

  // Full Page View
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notifications</h1>
              <p className="text-gray-600">Stay updated on important events</p>
            </div>
            <Button onClick={markAllRead} variant="outline" className="h-9">
              Mark all as read
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 border-b border-gray-200">
            {(['all', 'payroll', 'system', 'team'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'text-[#1E40AF] border-b-2 border-[#1E40AF] -mb-px'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications by Date */}
        <div className="space-y-8">
          {/* Today */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Today</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {notifList.slice(0, 2).map((notif) => (
                <div
                  key={notif.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === 'success' ? 'bg-green-50' :
                      notif.type === 'warning' ? 'bg-amber-50' :
                      notif.type === 'info' ? 'bg-blue-50' :
                      'bg-red-50'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <div className={`w-2 h-2 rounded-full ${getDotColor(notif.type)}`}></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notif.description}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yesterday */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Yesterday</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {notifList.slice(2, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === 'success' ? 'bg-green-50' :
                      notif.type === 'warning' ? 'bg-amber-50' :
                      notif.type === 'info' ? 'bg-blue-50' :
                      'bg-red-50'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <div className={`w-2 h-2 rounded-full ${getDotColor(notif.type)}`}></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notif.description}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last 7 Days */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Last 7 Days</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {notifList.slice(3).map((notif) => (
                <div
                  key={notif.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === 'success' ? 'bg-green-50' :
                      notif.type === 'warning' ? 'bg-amber-50' :
                      notif.type === 'info' ? 'bg-blue-50' :
                      'bg-red-50'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <div className={`w-2 h-2 rounded-full ${getDotColor(notif.type)}`}></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notif.description}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => onNavigate('hr-dashboard')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
