import {
  LayoutDashboard,
  Users,
  Zap,
  Settings,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  Wallet,
  Building2,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDisconnect, useAccount } from 'wagmi';
import { useDashboard, useCompany, useNotifications } from '@/hooks/useApi';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ currentPage, onNavigate, isMobileMenuOpen: externalMobileMenuOpen, setIsMobileMenuOpen: externalSetMobileMenuOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  // API data hooks
  const { company, loading: companyLoading } = useCompany(address);
  const { stats, loading: statsLoading } = useDashboard(address);
  const { unreadCount } = useNotifications(address);

  const isMobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  const setIsMobileMenuOpen = externalSetMobileMenuOpen || setInternalMobileMenuOpen;

  // Logout handler
  const handleLogout = () => {
    disconnect();
    onNavigate('landing');
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsCollapsed(!isCollapsed);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const employeeCount = stats?.employees?.total ?? 0;
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'employee-list', label: 'Employees', icon: Users, badge: employeeCount > 0 ? String(employeeCount) : null },
    { id: 'payroll-execution', label: 'Payroll', icon: Zap, badge: null },
    { id: 'reports', label: 'Reports', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const bottomItems = [
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
    { id: 'notifications-full', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? String(unreadCount) : null },
  ];

  const handleMenuItemClick = (page: string) => {
    onNavigate(page);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const showCompanyInfo = !isCollapsed || isMobile;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col ${isMobile
            ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72 z-50`
            : `${isCollapsed ? 'w-20' : 'w-72'} z-40`
          }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img
                  src="/Payve-Logo.png"
                  alt="Payve Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              {showCompanyInfo && (
                <div>
                  <div className="text-xl font-bold text-white">Payve</div>
                  <div className="text-xs text-cyan-400 font-semibold">Company Portal</div>
                </div>
              )}
            </div>
            {!isCollapsed && !isMobile && (
              <button
                onClick={handleToggle}
                className="w-8 h-8 rounded-lg bg-slate-700/50 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-all group"
              >
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* Company Info */}
        {showCompanyInfo && (
          <div className="px-4 py-4 border-b border-white/10">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
              {companyLoading || statsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{company?.company_name || 'My Company'}</div>
                      <div className="text-xs text-slate-400">Active</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Balance</span>
                      <span className="font-bold text-emerald-400">
                        ${((stats?.financials?.balance_usd ?? 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Employees</span>
                      <span className="font-bold text-cyan-400">{stats?.employees?.total ?? 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMenuItemClick('settings')}
                    className="w-full mt-3 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-3 h-3" />
                    Add Funds
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full"></div>
                  )}

                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`} />

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-semibold">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {isCollapsed && !isMobile && item.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-slate-900">
                      {item.badge}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Separator */}
          {!isCollapsed && (
            <div className="my-4 px-3">
              <div className="h-px bg-white/10"></div>
            </div>
          )}

          {/* Bottom Items */}
          <div className="space-y-1 mt-4">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`} />

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-semibold">{item.label}</span>
                      {item.badge && (
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {isCollapsed && !isMobile && item.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-slate-900">
                      {item.badge}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          {!isCollapsed ? (
            <div className="bg-slate-800/50 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {address ? address.slice(2, 4).toUpperCase() : 'AD'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm truncate">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Admin'}
                  </div>
                  <div className="text-xs text-slate-400">Admin</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full h-9 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                Sign Out
              </button>
            </div>
          ) : (
            !isMobile && (
              <button
                onClick={handleToggle}
                className="w-full h-12 bg-slate-700/50 hover:bg-slate-700 border border-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            )
          )}
        </div>

        {/* Powered by Base */}
        {showCompanyInfo && (
          <div className="px-4 pb-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300">Powered by Base L2</span>
              </div>
              <p className="text-xs text-slate-500">Instant • Secure • Low Fees</p>
            </div>
          </div>
        )}
      </aside>

      {/* Spacer for content */}
      {!isMobile && (
        <div className={`${isCollapsed ? 'w-20' : 'w-72'} flex-shrink-0`}></div>
      )}
    </>
  );
}
