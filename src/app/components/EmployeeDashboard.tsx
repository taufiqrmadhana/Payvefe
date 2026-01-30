import { Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Zap, TrendingUp, DollarSign, ExternalLink, Copy, Download, CheckCircle, Clock, Shield, LogOut, User, Settings as SettingsIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { usePayve, usePayveData } from '@/hooks/usePayve';
import { WithdrawModal } from '@/app/components/WithdrawModal';
import { useAccount, useDisconnect } from 'wagmi';
import { useEmployerConfig, useTransactions, useNotifications } from '@/hooks/useApi';
import { DEFAULT_EXCHANGE_RATE } from '@/constants';
import { transactionService } from '@/services';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const { claimInvite } = usePayve();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'payslip' | 'contract' | 'schedule' | 'claim' | 'settings' | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  
  // Employee Feature State
  const [inviteSecret, setInviteSecret] = useState('');
  
  // Persistent employer address configuration
  const { employerAddress, setEmployerAddress, isConfigured } = useEmployerConfig();
  
  // Fetch Employee Data from Smart Contract
  const { employee } = usePayveData(employerAddress || undefined);
  
  // Fetch transaction history from backend
  const { 
    transactions: apiTransactions, 
    loading: txLoading,
    refresh: refreshTransactions 
  } = useTransactions(address, false);
  
  // Fetch notifications
  const { unreadCount } = useNotifications(address);

  // Logout handler
  const handleLogout = () => {
    disconnect();
    onNavigate('landing');
  };

  // Formatting helpers
  const formatIDRX = (val: bigint | undefined) => val ? (Number(val) / 1e18).toLocaleString() : '0';
  const formatUSD = (val: bigint | undefined) => val ? (Number(val) / 1e18 / DEFAULT_EXCHANGE_RATE).toFixed(2) : '0.00';
  
  // Transform API transactions to display format
  const transactions = apiTransactions.map(tx => {
    const isReceive = ['distribute', 'claim_invite'].includes(tx.tx_type);
    const amountUsd = (tx.amount_wei / 1e18 / DEFAULT_EXCHANGE_RATE).toFixed(2);
    const amountIdrx = (tx.amount_wei / 1e18).toLocaleString();
    const date = new Date(tx.created_at);
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: isReceive ? 'receive' : 'send',
      title: tx.tx_type === 'distribute' ? 'Salary Payment' 
           : tx.tx_type === 'withdraw' ? 'Bank Withdrawal'
           : tx.tx_type === 'claim_invite' ? 'Job Claimed'
           : tx.tx_type,
      amount: `${isReceive ? '+' : '-'} $${amountUsd}`,
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }),
      hash: tx.tx_hash,
      status: tx.status,
      idrx: `${amountIdrx} IDRX`,
    };
  });

  const handleClaimInvite = async () => {
    if (!inviteSecret || !employerAddress) {
        alert("Please enter Secret AND Company Address");
        return;
    }
    setClaimLoading(true);
    try {
        const txHash = await claimInvite(employerAddress, inviteSecret);
        
        // Record transaction to backend
        if (address && txHash) {
            try {
                await transactionService.create({
                    wallet_address: address,
                    tx_hash: txHash,
                    tx_type: 'claim_invite',
                    amount_wei: 0,
                    status: 'success',
                    metadata: { company_contract: employerAddress },
                });
                refreshTransactions();
            } catch (e) {
                console.error("Failed to record tx:", e);
            }
        }
        
        alert("Invite claimed successfully! Your wallet is now linked to your employer.");
        setInviteSecret('');
        setActiveModal(null);
    } catch (e) {
        console.error("Claim failed:", e);
        alert("Failed to claim invite. Check console for details.");
    } finally {
        setClaimLoading(false);
    }
  };

  const handleWithdrawOpen = () => {
      if (!employerAddress) {
          alert("Please link your Employer Contract Address in Settings first");
          setActiveModal('settings');
          return;
      }
      setIsWithdrawOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
                  <img 
                    src="/src/public/Payve-Logo.png" 
                    alt="Payve Logo" 
                    className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg sm:text-xl font-bold text-white tracking-tight">Payve</div>
                  <div className="text-xs text-cyan-400 font-medium">Employee Portal</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-[10px] sm:text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Avatar with Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white/10 hover:shadow-cyan-500/50 transition-all"
                >
                  EMP
                </button>
                
                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <div className="absolute right-0 top-14 w-64 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            EMP
                          </div>
                          <div>
                            <p className="text-white font-semibold">{employee ? employee.name : "Employee"}</p>
                            <p className="text-xs text-slate-400">user@payve.com</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-left">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">My Profile</span>
                        </button>
                        <button 
                          onClick={() => { setActiveModal('settings'); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-left"
                        >
                          <SettingsIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">Job Settings</span>
                        </button>
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all text-left group"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 font-semibold">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl border border-white/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
              <p className="text-xs sm:text-sm uppercase text-white/90 tracking-wide font-semibold">Ready to Withdraw</p>
            </div>
            
            <div className="mb-6 sm:mb-8">
              <p className="text-4xl sm:text-6xl font-bold text-white mb-2">
                  ${formatUSD(employee?.balance)}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base sm:text-lg text-white/80 font-medium">
                    {formatIDRX(employee?.balance)} IDRX
                </p>
                <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs text-white font-semibold">
                  ≈ 1 USD = 16,000 IDRX
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleWithdrawOpen}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 sm:px-8 h-11 sm:h-12 rounded-xl font-bold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all w-full sm:w-auto"
              >
                <ArrowDownLeft className="w-5 h-5 mr-2" />
                Withdraw to Bank
              </Button>
              
              <Button 
                onClick={() => setActiveModal('claim')}
                className="bg-slate-800/80 hover:bg-slate-700/80 border border-white/20 text-white px-4 sm:px-6 h-11 sm:h-12 rounded-xl font-semibold backdrop-blur-sm w-full sm:w-auto"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Claim Job Invite
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Current Salary */}
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300 font-semibold">Monthly</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-semibold">Current Salary</p>
            <p className="text-4xl font-bold text-white mb-1">
                ${formatUSD(employee?.salary)}
            </p>
            <p className="text-sm text-slate-500">Net after taxes</p>
          </div>

          {/* Next Payroll */}
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-cyan-300 font-semibold">18 days</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-semibold">Next Payroll</p>
            <p className="text-4xl font-bold text-white mb-1">Feb 25</p>
            <p className="text-sm text-slate-500">Auto-deposited</p>
          </div>

          {/* Contract Status */}
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                <CheckCircle className="w-3 h-3 text-emerald-300" />
                <p className="text-xs text-emerald-300 font-semibold">Active</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-semibold">Contract Status</p>
            <p className="text-4xl font-bold text-emerald-400 mb-1">Active</p>
            <p className="text-sm text-slate-500">Until Dec 31, 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Transaction History - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Transactions</h2>
                </div>
                <button 
                  onClick={() => onNavigate('payroll-history')}
                  className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  See More →
                </button>
              </div>
              
              {txLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : (
              <div className="space-y-2">
                {transactions.map((tx, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-slate-700/50 transition-all border border-transparent hover:border-white/10"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                      tx.type === 'receive' 
                        ? 'bg-gradient-to-br from-emerald-500 to-green-500 group-hover:shadow-emerald-500/50' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:shadow-blue-500/50'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <p className="font-bold text-white text-base sm:text-lg truncate">{tx.title}</p>
                        <p className={`text-lg sm:text-xl font-bold flex-shrink-0 ${
                          tx.type === 'receive' ? 'text-emerald-400' : 'text-cyan-400'
                        }`}>{tx.amount}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-1 min-w-0">
                          <p className="text-slate-400 truncate">{tx.date} • {tx.time}</p>
                          <span className="text-slate-600 hidden sm:inline">•</span>
                          <p className="text-slate-500 truncate">{tx.idrx}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigator.clipboard.writeText(tx.hash)}
                            className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-all"
                            title="Copy hash"
                          >
                            <Copy className="w-4 h-4 text-slate-400" />
                          </button>
                          <a 
                            href={`https://basescan.org/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-all"
                            title="View on explorer"
                          >
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </a>
                        </div>
                      </div>
                      <div className="mt-1 hidden sm:block">
                        <p className="text-xs text-slate-600 font-mono truncate">{tx.hash}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}

              {!txLoading && transactions.length === 0 && (
                <div className="text-center py-16">
                  <TrendingUp className="w-20 h-20 mx-auto mb-4 text-slate-700" />
                  <p className="text-slate-400 text-lg font-medium">No transactions yet</p>
                  <p className="text-slate-600 text-sm mt-1">Your payment history will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
              <h3 className="font-bold text-white mb-4 text-lg">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveModal('payslip')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Download Payslip</p>
                    <p className="text-xs text-slate-400">January 2026</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveModal('contract')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">View Contract</p>
                    <p className="text-xs text-slate-400">Employment details</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveModal('schedule')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Payment Schedule</p>
                    <p className="text-xs text-slate-400">View upcoming</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white">Powered by Base L2</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                All transactions are instant, secure, and verified on the blockchain. Gas fees are minimal.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Network Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-semibold">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Avg. Gas Fee</span>
                  <span className="text-white font-semibold">$0.02</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Settlement Time</span>
                  <span className="text-white font-semibold">Instant</span>
                </div>
              </div>
            </div>

            {/* IDRX Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white">About IDRX</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                IDRX is a stablecoin pegged 1:1 to Indonesian Rupiah, ensuring your salary maintains stable value.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'payslip' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Payslip</h2>
                  <p className="text-sm sm:text-base text-slate-400">January 2026</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Employee Name</span>
                    <span className="text-white font-semibold">{employee?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Wallet Address</span>
                    <span className="text-white font-mono text-sm">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status</span>
                    <span className="text-emerald-400 font-semibold">{employee?.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Date</span>
                    <span className="text-white font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Monthly Salary (Gross)</span>
                    <span className="text-white font-semibold">${formatUSD(employee?.salary)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Salary in IDRX</span>
                    <span className="text-white font-semibold">{formatIDRX(employee?.salary)} IDRX</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Current Balance</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">${formatUSD(employee?.balance)}</p>
                      <p className="text-sm text-slate-400">{formatIDRX(employee?.balance)} IDRX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => setActiveModal(null)}
                  variant="outline" 
                  className="h-11 sm:h-12 px-6 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'contract' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Employment Contract</h2>
                  <p className="text-sm sm:text-base text-slate-400">Full-time Employee</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">Contract Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contract Type</span>
                        <span className="text-white">Full-time Employment</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className={employee?.isActive ? "text-emerald-400" : "text-red-400"}>{employee?.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Employee Name</span>
                        <span className="text-white">{employee?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wallet Address</span>
                        <span className="text-white font-mono text-xs">{address ? `${address.slice(0,8)}...${address.slice(-6)}` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10"></div>

                  <div>
                    <h3 className="text-white font-bold mb-2">Compensation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Salary</span>
                        <span className="text-white font-semibold">${formatUSD(employee?.salary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Salary in IDRX</span>
                        <span className="text-white font-semibold">{formatIDRX(employee?.salary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Currency</span>
                        <span className="text-white">IDRX (Stablecoin)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Frequency</span>
                        <span className="text-white">Monthly (25th)</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10"></div>

                  <div>
                    <h3 className="text-white font-bold mb-2">Employer Contract</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contract Address</span>
                        <span className="text-white font-mono text-xs">{employerAddress ? `${employerAddress.slice(0,8)}...${employerAddress.slice(-6)}` : 'Not linked'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Contract
                </Button>
                <Button 
                  onClick={() => setActiveModal(null)}
                  variant="outline" 
                  className="h-11 sm:h-12 px-6 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'schedule' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Payment Schedule</h2>
                  <p className="text-sm sm:text-base text-slate-400">Upcoming payroll dates</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
                <div className="space-y-4">
                  {(() => {
                    const salaryUsd = formatUSD(employee?.salary);
                    const today = new Date();
                    const schedules = [];
                    for (let i = 0; i < 4; i++) {
                      const payDate = new Date(today.getFullYear(), today.getMonth() + i, 25);
                      if (payDate <= today) payDate.setMonth(payDate.getMonth() + 1);
                      const daysUntil = Math.ceil((payDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      schedules.push({
                        month: payDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        date: payDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        amount: `$${salaryUsd}`,
                        status: i === 0 ? 'upcoming' : 'scheduled',
                        days: `${daysUntil} days`
                      });
                    }
                    return schedules;
                  })().map((payment, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        payment.status === 'upcoming' 
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500' 
                          : 'bg-slate-700'
                      }`}>
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{payment.month}</p>
                        <p className="text-sm text-slate-400">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{payment.amount}</p>
                        <p className="text-xs text-cyan-400">{payment.days}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'claim' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                    <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Claim Job Invite</h2>
                <p className="text-slate-400">Enter the secret code from your employer to link your account.</p>
            </div>

            <div className="space-y-4">
                <div>
                   <Label className="text-white mb-2 block">Company Contract Address</Label>
                   <Input 
                      placeholder="0x..." 
                      value={employerAddress}
                      onChange={(e) => setEmployerAddress(e.target.value)}
                      className="bg-slate-700/50 border-white/10 text-white mb-1"
                   />
                   <p className="text-xs text-slate-500">Ensure this matches your employer's contract.</p>
                </div>

                <div>
                   <Label className="text-white mb-2 block">Invite Secret</Label>
                   <Input 
                      placeholder="Enter secret code..." 
                      type="password"
                      value={inviteSecret}
                      onChange={(e) => setInviteSecret(e.target.value)}
                      className="bg-slate-700/50 border-white/10 text-white"
                   />
                </div>

                <Button 
                    onClick={handleClaimInvite}
                    disabled={claimLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg mt-4 disabled:opacity-50"
                >
                    {claimLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Claiming...
                      </>
                    ) : 'Claim Invite'}
                </Button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">
             <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-600 to-slate-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <SettingsIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Job Settings</h2>
                <p className="text-slate-400">Manage your employment connection.</p>
            </div>

            <div className="space-y-4">
                <div>
                   <Label className="text-white mb-2 block">Employer Contract Address</Label>
                   <div className="text-xs text-slate-400 mb-2">
                       This is the smart contract address of the company you work for. You need this to claim invites and withdraw funds.
                   </div>
                   <Input 
                      placeholder="0x..." 
                      value={employerAddress}
                      onChange={(e) => setEmployerAddress(e.target.value)}
                      className="bg-slate-700/50 border-white/10 text-white font-mono"
                   />
                   {isConfigured && (
                     <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                       <CheckCircle className="w-3 h-3" /> Address saved
                     </p>
                   )}
                </div>

                <Button 
                    onClick={() => setActiveModal(null)}
                    className="w-full h-12 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl mt-4"
                >
                    Save & Close
                </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revisit existing modals or close them properly */}
      {isWithdrawOpen && (
          <WithdrawModal onClose={() => setIsWithdrawOpen(false)} companyAddress={employerAddress} />
      )}
    </div>
  );
}
