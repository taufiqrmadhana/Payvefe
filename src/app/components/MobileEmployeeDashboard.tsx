import { Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Menu, Zap, DollarSign, Download, Shield, X, Loader2, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePayveData, usePayve } from '@/hooks/usePayve';
import { useEmployerConfig, useTransactions, useNotifications } from '@/hooks/useApi';
import { DEFAULT_EXCHANGE_RATE } from '@/constants';
import { transactionService } from '@/services';

interface MobileEmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function MobileEmployeeDashboard({ onNavigate }: MobileEmployeeDashboardProps) {
  const { address } = useAccount();
  const { claimInvite } = usePayve();
  const [activeModal, setActiveModal] = useState<'payslip' | 'contract' | 'schedule' | 'settings' | 'claim' | null>(null);
  const [inviteSecret, setInviteSecret] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  
  // Persistent employer address configuration
  const { employerAddress, setEmployerAddress, isConfigured } = useEmployerConfig();
  
  // Fetch Employee Data from Smart Contract
  const { employee } = usePayveData(employerAddress || undefined);
  
  // Fetch transaction history from backend
  const { 
    transactions: apiTransactions, 
    loading: txLoading,
  } = useTransactions(address, false);
  
  // Fetch notifications
  const { unreadCount } = useNotifications(address);
  
  // Formatting helpers
  const formatIDRX = (val: bigint | undefined) => val ? (Number(val) / 1e18).toLocaleString() : '0';
  const formatUSD = (val: bigint | undefined) => val ? (Number(val) / 1e18 / DEFAULT_EXCHANGE_RATE).toFixed(2) : '0.00';
  
  // Transform API transactions to display format
  const transactions = apiTransactions.slice(0, 3).map(tx => {
    const isReceive = ['distribute', 'claim_invite'].includes(tx.tx_type);
    const amountUsd = (tx.amount_wei / 1e18 / DEFAULT_EXCHANGE_RATE).toFixed(0);
    const date = new Date(tx.created_at);
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: isReceive ? 'receive' : 'send',
      title: tx.tx_type === 'distribute' ? 'Salary Payment' 
           : tx.tx_type === 'withdraw' ? 'Bank Withdrawal'
           : tx.tx_type === 'claim_invite' ? 'Job Claimed'
           : tx.tx_type,
      amount: `${isReceive ? '+' : '-'} $${amountUsd}`,
      status: tx.status,
    };
  });

  // Handle claim invite
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
        } catch (e) {
          console.error('Failed to record transaction:', e);
        }
      }
      
      alert("Job Claimed Successfully!");
      setInviteSecret('');
      setActiveModal(null);
    } catch (err) {
      console.error("Claim failed:", err);
      alert("Claim failed. Check the secret and address.");
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <img 
              src="/src/public/Payve-Logo.png" 
              alt="Payve Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
            />
          </div>
          <div>
            <div className="text-white font-bold">Payve</div>
            <div className="text-xs text-cyan-400">Employee</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal('settings')}
            className="relative w-10 h-10 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-slate-300" />
          </button>
          <button className="relative w-10 h-10 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Setup Prompt - shown when no employer is configured */}
        {!isConfigured && (
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-500/30 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Setup Required</h3>
            <p className="text-sm text-slate-300 mb-4">
              Connect to your employer's contract to view your salary and balance.
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => setActiveModal('claim')}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Claim Job Invite
              </Button>
              <Button 
                onClick={() => setActiveModal('settings')}
                variant="outline"
                className="w-full h-11 border-white/20 text-slate-300 hover:text-white hover:border-white/30 rounded-xl text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manual Setup
              </Button>
            </div>
          </div>
        )}

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-cyan-500/30 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <p className="text-xs uppercase text-slate-300 tracking-wide font-semibold">Balance</p>
          </div>
          <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
            ${formatUSD(employee?.balance)}
          </p>
          <p className="text-sm text-slate-400 mb-6">~{formatIDRX(employee?.balance)} IDRX</p>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('withdraw-modal')}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg text-sm"
            >
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              Withdraw
            </Button>
            <Button 
              onClick={() => setActiveModal('payslip')}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg text-sm"
            >
              <FileText className="w-4 h-4 mr-1" />
              Payslip
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase">Salary</p>
            <p className="text-2xl font-bold text-white">${formatUSD(employee?.salary)}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase">Next Pay</p>
            <p className="text-2xl font-bold text-white">25th</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <h3 className="font-bold text-white mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveModal('payslip')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Download Payslip</p>
                <p className="text-xs text-slate-400">January 2026</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveModal('contract')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">View Contract</p>
                <p className="text-xs text-slate-400">Employment details</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveModal('schedule')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Payment Schedule</p>
                <p className="text-xs text-slate-400">View upcoming</p>
              </div>
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Activity</h3>
            <button 
              onClick={() => onNavigate('payroll-history')}
              className="text-xs text-cyan-400 font-semibold"
            >
              View All
            </button>
          </div>

          {txLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No transactions yet</p>
            </div>
          ) : (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${
                  tx.type === 'receive' 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  {tx.type === 'receive' ? (
                    <ArrowDownLeft className="w-5 h-5 text-white" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{tx.title}</p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>

                <p className={`font-bold text-sm ${
                  tx.type === 'receive' ? 'text-emerald-400' : 'text-cyan-400'
                }`}>{tx.amount}</p>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Contract Info */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <p className="text-xs uppercase text-slate-300 tracking-wide font-semibold">Contract Status</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mb-1">
            {employee?.isActive ? 'Active' : 'Inactive'}
          </p>
          <p className="text-sm text-slate-400">
            {employee?.name || 'Connect employer to see details'}
          </p>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <Zap className="w-4 h-4" />
            <span>Powered by Base L2 • Instant & Secure</span>
          </div>
        </div>
      </main>

      {/* Payslip Modal */}
      {activeModal === 'payslip' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Payslip</h2>
                  <p className="text-sm text-slate-400">January 2026</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Employee Name</span>
                    <span className="text-white font-semibold">{employee?.name || 'Employee'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Wallet Address</span>
                    <span className="text-white font-mono text-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Employer</span>
                    <span className="text-white font-mono text-xs">{employerAddress?.slice(0, 6)}...{employerAddress?.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Payment Date</span>
                    <span className="text-white font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-3"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Gross Salary</span>
                    <span className="text-white font-semibold">${formatUSD(employee?.salary)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Tax Deduction</span>
                    <span className="text-red-400 font-semibold">- ${(Number(formatUSD(employee?.salary)) * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Platform Fee</span>
                    <span className="text-slate-400 font-semibold">- ${(Number(formatUSD(employee?.salary)) * 0.005).toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-3"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Net Salary</span>
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">${(Number(formatUSD(employee?.salary)) * 0.895).toFixed(2)}</p>
                      <p className="text-xs text-slate-400">{formatIDRX(employee?.salary ? BigInt(Number(employee.salary) * 895 / 1000) : undefined)} IDRX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => setActiveModal(null)}
                  className="w-full h-11 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {activeModal === 'contract' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Contract</h2>
                  <p className="text-sm text-slate-400">Full-time Employee</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 mb-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2 text-sm">Contract Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Employee Name</span>
                        <span className="text-white">{employee?.name || 'Employee'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wallet Address</span>
                        <span className="text-white font-mono text-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Employer Contract</span>
                        <span className="text-white font-mono text-xs">{employerAddress?.slice(0, 6)}...{employerAddress?.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Salary</span>
                        <span className="text-white font-semibold">${formatUSD(employee?.salary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className={employee?.isActive ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>{employee?.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setActiveModal(null)}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {activeModal === 'schedule' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Payment Schedule</h2>
                  <p className="text-sm text-slate-400">Upcoming payments</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {(() => {
                  const now = new Date();
                  const months = [];
                  for (let i = 0; i < 3; i++) {
                    const payDate = new Date(now.getFullYear(), now.getMonth() + i, 25);
                    if (payDate < now) payDate.setMonth(payDate.getMonth() + 1);
                    const daysUntil = Math.ceil((payDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    months.push({ payDate, daysUntil, isNext: i === 0 });
                  }
                  return months.map((m, idx) => (
                    <div key={idx} className={`bg-slate-700/50 rounded-xl p-4 ${m.isNext ? 'border border-cyan-500/30' : ''}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={m.isNext ? 'text-cyan-400 font-bold' : 'text-white font-bold'}>
                          {m.payDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <span className="text-white font-bold">${formatUSD(employee?.salary)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Payment Date</span>
                        <span className="text-slate-300">
                          {m.payDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Status</span>
                        <span className={m.isNext ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
                          {m.isNext ? `In ${m.daysUntil} days` : 'Scheduled'}
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <Button 
                onClick={() => setActiveModal(null)}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {activeModal === 'claim' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Claim Job Invite</h2>
                  <p className="text-sm text-slate-400">Link your account to employer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block text-sm">Company Contract Address</Label>
                  <Input 
                    placeholder="0x..." 
                    value={employerAddress}
                    onChange={(e) => setEmployerAddress(e.target.value)}
                    className="bg-slate-700/50 border-white/10 text-white mb-1 h-11"
                  />
                  <p className="text-xs text-slate-500">Ensure this matches your employer's contract.</p>
                </div>

                <div>
                  <Label className="text-white mb-2 block text-sm">Invite Secret</Label>
                  <Input 
                    placeholder="Enter secret code..." 
                    type="password"
                    value={inviteSecret}
                    onChange={(e) => setInviteSecret(e.target.value)}
                    className="bg-slate-700/50 border-white/10 text-white h-11"
                  />
                </div>

                <Button 
                  onClick={handleClaimInvite}
                  disabled={claimLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg mt-2 disabled:opacity-50"
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
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Job Settings</h2>
                  <p className="text-sm text-slate-400">Manage your employment connection</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block text-sm">Employer Contract Address</Label>
                  <p className="text-xs text-slate-400 mb-2">
                    This is the smart contract address of the company you work for.
                  </p>
                  <Input 
                    placeholder="0x..." 
                    value={employerAddress}
                    onChange={(e) => setEmployerAddress(e.target.value)}
                    className="bg-slate-700/50 border-white/10 text-white font-mono h-11"
                  />
                  {isConfigured && (
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Address saved
                    </p>
                  )}
                </div>

                <Button 
                  onClick={() => setActiveModal(null)}
                  className="w-full h-11 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl mt-2"
                >
                  Save & Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
