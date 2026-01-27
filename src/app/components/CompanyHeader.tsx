import { Menu, X, Bell, Search } from 'lucide-react';
import { 
  Wallet, 
  ConnectWallet, 
  WalletDropdown, 
  WalletDropdownLink, 
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit/wallet';
import { 
  Address, 
  Avatar, 
  Name, 
  Identity, 
  EthBalance 
} from '@coinbase/onchainkit/identity';

interface CompanyHeaderProps {
  title: string;
  subtitle?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isMobile: boolean;
  onNavigate?: (page: string) => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  children?: React.ReactNode;
}

export function CompanyHeader({ 
  title, 
  subtitle, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  isMobile,
  onNavigate,
  showSearch = false,
  showNotifications = true,
  children 
}: CompanyHeaderProps) {
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
            
            <div className="hidden md:block">
             <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address className='text-xs text-slate-400'/>
                  <EthBalance />
                </Identity>
                <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
            </div>

            {/* Notifications */}
            {showNotifications && onNavigate && (
              <button 
                onClick={() => onNavigate('notifications-full')}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-[10px] sm:text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">3</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
