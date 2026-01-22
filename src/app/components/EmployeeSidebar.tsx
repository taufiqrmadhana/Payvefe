import { 
  LayoutDashboard, 
  Zap, 
  Settings, 
  HelpCircle,
  LogOut,
  Wallet,
  User,
  Sparkles,
  Menu,
  X,
  FileText,
  History
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmployeeSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function EmployeeSidebar({ currentPage, onNavigate, isMobileMenuOpen: externalMobileMenuOpen, setIsMobileMenuOpen: externalSetMobileMenuOpen }: EmployeeSidebarProps) {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const isMobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  const setIsMobileMenuOpen = externalSetMobileMenuOpen || setInternalMobileMenuOpen;

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

  const menuItems = [
    { id: 'employee-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'payroll-history', label: 'Payroll History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const bottomItems = [
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleMenuItemClick = (page: string) => {
    onNavigate(page);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

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
        className={`fixed left-0 top-0 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col w-72 ${
          isMobile 
            ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50` 
            : 'z-40'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 relative">
              <Zap className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">Payve</div>
              <div className="text-xs text-cyan-400 font-semibold">Employee Portal</div>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">Alex Smith</div>
                <div className="text-xs text-slate-400">Software Engineer</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Balance</span>
                <span className="font-bold text-emerald-400">$430.00</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">IDRX</span>
                <span className="font-bold text-cyan-400">6,880,000</span>
              </div>
            </div>

            <button 
              onClick={() => handleMenuItemClick('withdraw-modal')}
              className="w-full mt-3 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-xs text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <Wallet className="w-3 h-3" />
              Withdraw
            </button>
          </div>
        </div>

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
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full"></div>
                  )}
                  
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`} />
                  
                  <span className="flex-1 text-left font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Separator */}
          <div className="my-4 px-3">
            <div className="h-px bg-white/10"></div>
          </div>

          {/* Bottom Items */}
          <div className="space-y-1 mt-4">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`} />
                  
                  <span className="flex-1 text-left font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                AS
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">Alex Smith</div>
                <div className="text-xs text-slate-400">Employee</div>
              </div>
            </div>
            
            <button
              onClick={() => handleMenuItemClick('landing')}
              className="w-full h-9 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Powered by Base */}
        <div className="px-4 pb-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-300">Powered by Base L2</span>
            </div>
            <p className="text-xs text-slate-500">Instant • Secure • Low Fees</p>
          </div>
        </div>
      </aside>

      {/* Spacer for content */}
      {!isMobile && (
        <div className="w-72 flex-shrink-0"></div>
      )}
    </>
  );
}
