import { Menu, X, Bell } from 'lucide-react';

interface EmployeeHeaderProps {
  title: string;
  subtitle?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isMobile: boolean;
  children?: React.ReactNode;
}

export function EmployeeHeader({ 
  title, 
  subtitle, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  isMobile,
  children 
}: EmployeeHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
      <div className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
