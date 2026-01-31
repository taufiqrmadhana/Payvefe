'use client';

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
  const [isMobile, setIsMobile] = useState(false);
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  // API data hooks
  const { company, loading: companyLoading } = useCompany(address);
  const { stats, loading: statsLoading } = useDashboard(address);
  const { unreadCount } = useNotifications(address);

  const isMobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : false;
  const setIsMobileMenuOpen = externalSetMobileMenuOpen || (() => {});

  const handleLogout = () => {
    disconnect();
    onNavigate('landing');
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobileMenuOpen]);

  const employeeCount = stats?.employees?.total ?? 0;
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employee-list', label: 'Employees', icon: Users, badge: employeeCount > 0 ? String(employeeCount) : null },
    { id: 'payroll-execution', label: 'Payroll', icon: Zap },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const bottomItems = [
    { id: 'help-support', label: 'Support', icon: HelpCircle },
    { id: 'notifications-full', label: 'Alerts', icon: Bell, badge: unreadCount > 0 ? String(unreadCount) : null },
  ];

  const handleMenuItemClick = (page: string) => {
    onNavigate(page);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const showCompanyInfo = !isCollapsed || isMobile;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Menggunakan warna Midnight pekat agar kontras dengan Content Area */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0B0F1A]/95 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out flex flex-col ${
          isMobile
            ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72 z-50`
            : `${isCollapsed ? 'w-20' : 'w-72'} z-40`
        }`}
      >
        {/* Header - Brand Identity */}
        <div className="p-8">
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0">
              <img
                src="/Payve-Logo.png"
                alt="Payve"
                className="w-9 h-9 object-contain"
              />
            </div>
            {showCompanyInfo && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <div className="text-xl font-bold text-white tracking-tight leading-none mb-1">Payve</div>

              </div>
            )}
          </div>
        </div>

        {/* Dynamic Company Status Card */}
        {showCompanyInfo && (
          <div className="px-5 mb-6">
            <div className="relative group overflow-hidden p-4 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-50" />
              {companyLoading || statsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{company?.company_name || 'Organization'}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">On-Chain Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treasury</span>
                      <span className="text-xs font-bold text-white">${((stats?.financials?.balance_usd ?? 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Staff Count</span>
                      <span className="text-xs font-bold text-white">{employeeCount} Nodes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Navigation - High End Menu Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute -left-1 w-1.5 h-6 bg-white rounded-full shadow-[0_0_10px_white]" />
                )}

                <Icon className={`w-5 h-5 flex-shrink-0 transition-all ${
                  isActive ? 'text-white scale-110' : 'text-slate-500 group-hover:text-slate-200'
                }`} />

                {showCompanyInfo && (
                  <div className="flex-1 flex items-center justify-between animate-in fade-in slide-in-from-left-1">
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
                
                {isCollapsed && !isMobile && item.badge && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-[#0B0F1A]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Area - Profile & Controls */}
        <div className="p-4 border-t border-white/5 bg-black/10">
          <div className="space-y-1 mb-4">
            {bottomItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all text-slate-500 hover:text-white ${
                  currentPage === item.id ? 'bg-white/5 text-white' : ''
                }`}
              >
                <item.icon className="w-4 h-4" />
                {showCompanyInfo && (
                   <div className="flex-1 flex items-center justify-between">
                     <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                     {item.badge && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
                   </div>
                )}
              </button>
            ))}
          </div>

          <div className={`p-4 bg-white/5 rounded-2xl border border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg border border-white/10 flex-shrink-0">
                {address ? address.slice(2, 4).toUpperCase() : 'AD'}
              </div>
              {showCompanyInfo && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Admin'}
                  </div>
                  <button onClick={handleLogout} className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors">Sign Out</button>
                </div>
              )}
            </div>
          </div>

          {/* {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full mt-4 h-10 flex items-center justify-center text-slate-600 hover:text-white transition-all bg-white/[0.02] border border-white/5 rounded-xl group"
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'} group-hover:scale-110`} />
            </button>
          )} */}
        </div>

        {/* Base Logo Subtle Watermark
        {showCompanyInfo && (
          <div className="px-8 pb-8 text-center opacity-30">
             <div className="flex items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Base Network</span>
             </div>
          </div>
        )} */}
      </aside>

      {/* Spacer for desktop content area */}
      {!isMobile && (
        <div className={`transition-all duration-500 ${isCollapsed ? 'w-20' : 'w-72'} flex-shrink-0`}></div>
      )}
    </>
  );
}