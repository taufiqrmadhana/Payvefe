'use client';

import { 
  Users, TrendingUp, ArrowRight, Zap, 
  FileCheck, CheckCircle, Plus, 
  Settings as SettingsIcon, ChevronRight, Clock, 
  CircleDollarSign, ChartBarDecreasing, Loader2, RefreshCw, Wallet, Calendar 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { useState, useEffect } from 'react';
import { usePayve } from '@/hooks/usePayve';
import { useAccount } from 'wagmi';
import { useDashboard, useTransactions, usePayrollSchedule } from '@/hooks/useApi';

interface PayveDashboardProps {
  onNavigate: (page: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Not scheduled';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const diffMs = new Date().getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffMs / 86400000)}d ago`;
};

export function PayveDashboard({ onNavigate }: PayveDashboardProps) {
  const { address } = useAccount();
  const { deposit, distribute } = usePayve();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // API Data
  const { stats, loading: dashboardLoading, refreshStats } = useDashboard(address);
  const { transactions, loading: txLoading } = useTransactions(address, true);
  const { nextSchedule, loading: scheduleLoading } = usePayrollSchedule(address);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleExecutePayroll = async () => {
    if (confirm("Authorize blockchain execution for pending payroll?")) {
      try {
        await distribute();
        refreshStats();
      } catch (e) { console.error(e); }
    }
  };

  const handleDeposit = async () => {
    const amountStr = prompt("Enter amount to deposit (USD):");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    const amountWei = BigInt(Math.floor(amount * 16000)) * BigInt(10 ** 18);
    try {
      await deposit(amountWei);
      refreshStats();
    } catch (e) { console.error(e); }
  };

  const activeEmployees = stats?.employees?.active || 0;
  const monthlyPayroll = stats?.financials?.total_monthly_payroll_usd || 0;
  const balance = stats?.financials?.balance_usd || 0;
  const nextPayrollAmount = stats?.next_payroll?.estimated_amount_usd || monthlyPayroll;
  const isLoading = dashboardLoading || txLoading || scheduleLoading;

  // Process Real Transactions
  const displayTransactions = transactions
    .filter(tx => !tx.tx_hash.match(/^0x0{60,}/i))
    .slice(0, 3)
    .map(tx => ({
      icon: tx.tx_type === 'distribute' ? CheckCircle : tx.tx_type === 'deposit' ? Plus : SettingsIcon,
      color: tx.tx_type === 'distribute' ? 'text-emerald-400' : tx.tx_type === 'deposit' ? 'text-blue-400' : 'text-slate-400',
      title: tx.tx_type === 'distribute' ? 'Payroll executed' : tx.tx_type === 'deposit' ? 'Deposit received' : 'Transaction',
      desc: `${tx.tx_hash.slice(0, 6)}...${tx.tx_hash.slice(-4)}`,
      time: formatRelativeTime(tx.created_at)
    }));

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto relative">
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <CompanyHeader 
          title="Dashboard"
          subtitle="Real-time Capital Infrastructure"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
        >
          <button onClick={() => refreshStats()} className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </CompanyHeader>

        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 relative z-10">
          
          {/* HERO CARD */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-[40px] p-8 sm:p-10 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Node Status: Operational</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">System Overview.</h1>
                <p className="text-slate-400 mb-8 max-w-md leading-relaxed text-sm font-medium">
                  {nextSchedule?.scheduled_date 
                    ? `Your next payroll cycle is automated for ${formatDate(nextSchedule.scheduled_date)}.`
                    : 'Smart contract is active on Base L2. No distribution currently queued.'}
                </p>
                <Button 
                  onClick={handleExecutePayroll}
                  disabled={!nextSchedule?.scheduled_date}
                  className="h-12 px-8 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-white/10 disabled:opacity-20"
                >
                  Execute Batch Distribution <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <HeroStat label="Active Nodes" val={isLoading ? '...' : String(activeEmployees)} sub="Employees" />
                <HeroStat label="Queued Vol" val={isLoading ? '...' : formatCurrency(nextPayrollAmount)} sub="Scheduled" />
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users className="text-blue-400" />} label="Staff Size" value={isLoading ? '...' : String(stats?.employees?.total || 0)} trend="+2" />
            <StatCard icon={<TrendingUp className="text-purple-400" />} label="Monthly Vol" value={isLoading ? '...' : formatCurrency(monthlyPayroll)} trend="Stable" />
            <StatCard icon={<FileCheck className="text-emerald-400" />} label="Active" value={isLoading ? '...' : String(activeEmployees)} trend="Active" />
            <StatCard icon={<Zap className="text-cyan-400" />} label="Treasury" value={isLoading ? '...' : formatCurrency(balance)} trend="Base L2" onAction={handleDeposit} actionText="+ Top Up" />
          </div>

          {/* LOWER SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
             <div className="lg:col-span-2 p-8 bg-white/[0.02] backdrop-blur-[30px] rounded-[2.5rem] border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-8 tracking-tight">
                  <Clock className="w-5 h-5 text-slate-500" /> Activity Log
                </h3>
                <div className="space-y-2">
                  {displayTransactions.length > 0 ? displayTransactions.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.04] transition-all group border border-transparent hover:border-white/5 cursor-pointer">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color} border border-white/5 group-hover:scale-105 transition-all`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white uppercase tracking-tight">{item.title}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{item.desc}</div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{item.time}</div>
                    </div>
                  )) : (
                    <div className="text-center py-10 text-slate-600 text-xs font-bold uppercase tracking-widest">No Recent Logs Found</div>
                  )}
                </div>
             </div>

             <div className="p-8 bg-[#0B0F1A]/80 backdrop-blur-[40px] rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col">
                <h3 className="text-lg font-bold text-white mb-8 tracking-tight flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" /> Actions
                </h3>
                <div className="space-y-3 flex-1">
                  {[
                    { label: 'Onboard Employee', action: 'employee-list', icon: Plus },
                    { label: 'Payroll Protocol', action: 'payroll-execution', icon: CircleDollarSign },
                    { label: 'Analytical Reports', action: 'reports', icon: ChartBarDecreasing },
                    { label: 'System Configuration', action: 'settings', icon: SettingsIcon },
                  ].map((btn, i) => (
                    <button 
                      key={i}
                      onClick={() => onNavigate(btn.action)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group active:scale-95"
                    >
                      <div className="flex items-center gap-4">
                        <btn.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 group-hover:text-white">{btn.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HeroStat({ label, val, sub }: { label: string, val: string, sub: string }) {
  return (
    <div className="p-6 bg-white/[0.05] rounded-[2rem] border border-white/5 backdrop-blur-md group hover:border-white/20 transition-all">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{val}</p>
      <p className="text-[10px] font-medium text-slate-600 uppercase mt-1">{sub}</p>
    </div>
  );
}

function StatCard({ icon, label, value, trend, onAction, actionText }: { icon: any, label: string, value: string, trend: string, onAction?: () => void, actionText?: string }) {
  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-[30px] rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        {onAction ? (
          <button onClick={onAction} className="text-[9px] font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-widest">{actionText}</button>
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-tighter text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{trend}</span>
        )}
      </div>
      <div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      </div>
    </div>
  );
}