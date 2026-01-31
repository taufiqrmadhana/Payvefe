'use client';

import React from 'react';
import { Menu, X, Bell, ChevronDown, Building2, Users, Wallet as WalletIcon } from 'lucide-react';
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
import { useAccount } from 'wagmi';
import { useDashboard, useCompany, useNotifications } from '@/hooks/useApi';

interface CompanyHeaderProps {
  title: string;
  subtitle?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isMobile: boolean;
  onNavigate?: (page: string) => void;
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
  showNotifications = true,
  children
}: CompanyHeaderProps) {
  const { address } = useAccount();
  const { company } = useCompany(address);
  const { stats } = useDashboard(address);
  const { unreadCount } = useNotifications(address);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0B0F1A]/80 border-b border-white/5 shadow-lg shadow-black/20">
      <div className="px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left: Nav & Page Title */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            )}

            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none mb-1">{title}</h1>
              {subtitle && (
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}