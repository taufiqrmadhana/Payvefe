'use client';

import { ArrowLeft, Briefcase, User, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';

interface AuthenticationProps {
  onNavigate: (page: string) => void;
}

export function Authentication({ onNavigate }: AuthenticationProps) {
  const [accountType, setAccountType] = useState<'company' | 'employee'>('company');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Memastikan redirect hanya terjadi jika wallet benar-benar terhubung
    if (isConnected && address) {
      setIsRedirecting(true);
      setIsChecking(true);

      // Simple redirect logic - go directly to appropriate dashboard
      const timer = setTimeout(() => {
        if (accountType === 'company') {
          // Always go to dashboard for company users
          // Dashboard will show demo data if API fails
          onNavigate('dashboard');
        } else {
          // Employee portal
          onNavigate('employee-dashboard');
        }
        setIsChecking(false);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // Jika terputus, pastikan loading state berhenti
      setIsRedirecting(false);
      setIsChecking(false);
    }
  }, [isConnected, address, onNavigate, accountType]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500/20">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Minimalis */}
      <div className="absolute top-8 sm:top-12 left-0 right-0 px-8 sm:px-12 flex justify-between items-center w-full max-w-7xl mx-auto">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('landing')}
        >
          <img
            src="/Payve-Logo.svg"
            alt="Payve Logo"
            className="w-8 h-8 opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="text-lg font-medium text-white tracking-tight">Payve</span>
        </div>

        {!isRedirecting && (
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Landing
          </button>
        )}
      </div>

      {/* Konten Utama */}
      <div className="w-full max-w-[400px] relative z-10">
        {isRedirecting ? (
          /* Tampilan Elegan saat Proses Redirect */
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500 text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
              <div className="absolute -inset-4 bg-cyan-500/10 blur-2xl rounded-full -z-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {isChecking ? 'Checking Account' : 'Verifying Identity'}
              </h2>
              <p className="text-slate-500 text-sm">
                Securely accessing your <span className="text-cyan-400 font-medium capitalize">{accountType}</span> portal...
              </p>
            </div>
          </div>
        ) : (
          /* Tampilan Form Login */
          <div className="space-y-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-white tracking-tight">Get Started</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Select your portal and connect wallet <br />
                to access <span className="text-slate-300 font-medium">Payve</span>
              </p>
            </div>

            {/* Switcher Tipe Akun */}
            <div className="w-full flex p-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
              <button
                onClick={() => setAccountType('company')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold tracking-widest transition-all duration-300 ${accountType === 'company'
                  ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                  : 'text-slate-500 hover:text-slate-400'
                  }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                COMPANY
              </button>
              <button
                onClick={() => setAccountType('employee')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold tracking-widest transition-all duration-300 ${accountType === 'employee'
                  ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                  : 'text-slate-500 hover:text-slate-400'
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                EMPLOYEE
              </button>
            </div>

            {/* Area Tombol Connect Wallet */}
            <div className="w-full flex flex-col items-center space-y-8">
              <div className="flex justify-center w-full">
                <Wallet>
                  <ConnectWallet
                    className="!bg-white !text-black hover:!bg-slate-200 !rounded-2xl !font-bold !transition-all !border-none px-8 h-14 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6" />
                      <Name className="text-black" />
                      {!isConnected && <span>Connect Wallet</span>}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </ConnectWallet>

                  <WalletDropdown className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl mt-2 overflow-hidden">
                    <Identity className="px-4 pt-4 pb-2" hasCopyAddressOnClick>
                      <Avatar />
                      <Name className="text-white" />
                      <Address className="text-slate-500" />
                      <EthBalance className="text-cyan-400 font-bold" />
                    </Identity>
                    <div className="h-px bg-white/5 mx-4 my-2" />
                    <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com" className="text-slate-300 hover:bg-white/5">
                      Settings
                    </WalletDropdownLink>
                    <WalletDropdownDisconnect className="text-red-400 hover:bg-red-500/10 font-semibold" />
                  </WalletDropdown>
                </Wallet>
              </div>

              {/* Indikator Status */}
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Onchain Verification Required
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Security */}
        <div className="pt-12 flex items-center justify-center gap-6 opacity-30">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <div className="w-px h-3 bg-slate-800" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            Base Layer 2 Secured
          </span>
        </div>
      </div>
    </div>
  );
}