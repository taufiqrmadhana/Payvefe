import { ArrowLeft, Zap } from 'lucide-react';
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
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      // In a real app, we'd check on-chain role here.
      // For now, we auto-redirect based on the toggle selection after a short delay
      const timer = setTimeout(() => {
        if (accountType === 'company') {
          onNavigate('dashboard');
        } else {
          onNavigate('employee-dashboard');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, accountType, onNavigate]);

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col">
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-bold text-white">Payve</div>
            </div>
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 pb-16">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-white mb-2">Connect to Payve</h1>
            <p className="text-slate-400 mb-8">Access your {accountType} dashboard</p>

            {/* Account Type Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setAccountType('company')}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                  accountType === 'company'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Company
              </button>
              <button
                onClick={() => setAccountType('employee')}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                  accountType === 'employee'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Employee
              </button>
            </div>

            <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  {isConnected ? 'Wallet Connected' : 'Connect Smart Wallet'}
                </h3>
                <p className="text-slate-400 text-sm">
                  {isConnected 
                    ? 'Redirecting you to the dashboard...' 
                    : 'Log in with FaceID, TouchID, or Email'}
                </p>
              </div>

              <Wallet>
                <ConnectWallet className="w-full">
                  <Avatar className="h-6 w-6" />
                  <Name />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                    Wallet
                  </WalletDropdownLink>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>

            {/* Footer Links */}
            <div className="mt-12 text-center text-xs text-slate-500">
              <span className="opacity-50">Powered by Coinbase OnchainKit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Brand Showcase */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
        {/* Animated Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        ></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-16">
          <div className="max-w-lg">
            <blockquote className="text-3xl font-bold mb-6 leading-tight">
              "We reduced payroll processing time from 2 hours to 2 minutes"
            </blockquote>
            <p className="text-cyan-200 mb-12 text-lg">
              Sarah Chen, CFO at RemoteCo
            </p>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-cyan-400/30">
              <div>
                <div className="text-3xl font-bold mb-1">$2.4M</div>
                <div className="text-sm text-slate-300">Processed monthly</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">1,200+</div>
                <div className="text-sm text-slate-300">Employees paid</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">99.9%</div>
                <div className="text-sm text-slate-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
