import { Menu, X, Bell, Search, ChevronDown } from 'lucide-react';
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
      <div className="px-4 sm:px-8 py-4 sm:py-5">
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

            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-cyan-500/20">
                <img
                  src="/Payve-Logo.svg"
                  alt="Payve"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            {showSearch && (
              <button className="hidden md:flex w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/50 border border-white/10 items-center justify-center hover:bg-slate-700/50 transition-all">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>
            )}

            {/* Custom Actions */}
            {children}

            {/* Wallet Connect - Desktop */}
            <div className="hidden md:block">
              <Wallet>
                <ConnectWallet
                  className="!bg-slate-800/80 hover:!bg-slate-700/80 !border !border-white/10 !rounded-xl !px-4 !py-2.5 !h-11 !shadow-lg !transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="!h-7 !w-7 !rounded-lg !ring-2 !ring-cyan-500/30 group-hover:!ring-cyan-400/50 transition-all" />
                    <div className="flex flex-col items-start gap-0.5">
                      <Name className="!text-white !text-sm !font-bold leading-none" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </ConnectWallet>
                <WalletDropdown className="!bg-[#0f172a] !border !border-slate-800 !rounded-2xl !shadow-2xl !mt-3 !overflow-hidden !min-w-[300px] !p-0 ring-1 ring-white/10">
                  <div className="p-5 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
                    <Identity hasCopyAddressOnClick className="!flex !flex-row !items-center !gap-4">
                      <Avatar className="!h-14 !w-14 !rounded-2xl !ring-4 !ring-slate-800 shadow-xl" />
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <Name className="!text-white !font-bold !text-lg tracking-tight" />
                        <Address className="!text-xs !text-slate-400 !bg-slate-800/50 !px-2 !py-1 !rounded-lg" />
                      </div>
                    </Identity>
                    <div className="mt-4 p-3.5 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                      <span className="text-xs font-medium text-slate-400">Balance</span>
                      <EthBalance className="!text-xl !font-bold !text-cyan-400" />
                    </div>
                  </div>
                  <div className="p-2 bg-slate-950">
                    <WalletDropdownLink
                      icon="wallet"
                      href="https://keys.coinbase.com"
                      className="!text-slate-300 hover:!text-white hover:!bg-slate-900 !rounded-xl !px-4 !py-3 !transition-all !font-medium"
                    >
                      Wallet Settings
                    </WalletDropdownLink>
                    <div className="h-px bg-slate-900 my-1" />
                    <WalletDropdownDisconnect className="!w-full !text-red-400 hover:!text-red-300 hover:!bg-red-500/10 !rounded-xl !font-medium !px-4 !py-3 !justify-start" />
                  </div>
                </WalletDropdown>
              </Wallet>
            </div>

            {/* Wallet Connect - Mobile */}
            <div className="block md:hidden">
              <Wallet>
                <ConnectWallet
                  className="!bg-slate-800/80 hover:!bg-slate-700/80 !border !border-white/10 !rounded-xl !p-2.5 !h-10 !w-10"
                >
                  <Avatar className="!h-5 !w-5 !rounded-md" />
                </ConnectWallet>
                <WalletDropdown className="!bg-slate-900 !border !border-white/10 !rounded-2xl !shadow-2xl !mt-2 !overflow-hidden !min-w-[260px] !right-0">
                  <div className="p-4 border-b border-white/10 bg-gradient-to-br from-blue-600/10 to-cyan-600/10">
                    <Identity hasCopyAddressOnClick>
                      <div className="flex items-center gap-3">
                        <Avatar className="!h-10 !w-10 !rounded-xl !ring-2 !ring-cyan-500/30" />
                        <div className="flex-1 min-w-0">
                          <Name className="!text-white !font-semibold" />
                          <Address className="!text-xs !text-slate-400" />
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-slate-800/50 rounded-lg border border-white/5">
                        <EthBalance className="!text-sm !font-bold !text-cyan-400" />
                      </div>
                    </Identity>
                  </div>
                  <div className="p-2">
                    <WalletDropdownLink
                      icon="wallet"
                      href="https://keys.coinbase.com"
                      className="!text-slate-300 hover:!bg-slate-800/50 !rounded-xl"
                    >
                      Wallet
                    </WalletDropdownLink>
                    <WalletDropdownDisconnect className="!w-full !text-red-400 hover:!bg-red-500/10 !rounded-xl !font-semibold" />
                  </div>
                </WalletDropdown>
              </Wallet>
            </div>

            {/* Notifications */}
            {showNotifications && onNavigate && (
              <button
                onClick={() => onNavigate('notifications-full')}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all group"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full text-[10px] sm:text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  3
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
