'use client';

import { 
  Calendar, Download, TrendingUp, DollarSign, Users, FileText, 
  BarChart3, ArrowUpRight, Loader2, Landmark, Zap, ChevronRight 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useDashboard, useTransactions } from '@/hooks/useApi';

interface ReportsProps {
  onNavigate: (page: string) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { address } = useAccount();
  
  const { stats, analytics, loading: dashboardLoading } = useDashboard(address);
  const { transactions, total: txTotal, loading: txLoading } = useTransactions(address, true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isLoading = dashboardLoading || txLoading;

  const totalPaid = stats?.financials?.total_paid_usd ?? 0;
  const employeeCount = stats?.employees?.total ?? 0;
  const activeCount = stats?.employees?.active ?? 0;
  const avgSalary = employeeCount > 0 ? (stats?.financials?.total_monthly_payroll_usd ?? 0) / employeeCount : 0;
  const transactionCount = txTotal ?? 0;
  const payrollHistory = analytics?.payroll_history ?? [];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Sidebar currentPage="reports" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto relative">
        {/* BACKGROUND AURAS */}
        <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <CompanyHeader 
          title="Intelligence"
          subtitle="Analytical Insights & Data Ledger"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
        >
          <Button className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-blue-500/30 rounded-xl transition-all duration-300 flex items-center gap-2 active:scale-95 group">
            <Download className="w-4 h-4 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Export Data</span>
          </Button>
        </CompanyHeader>

        <div className="p-6 sm:p-10 relative z-10 max-w-7xl mx-auto space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Compiling Report Data...</p>
            </div>
          ) : (
            <>
              {/* SUMMARY STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Landmark className="text-blue-400" />} label="Total Volume" value={`$${totalPaid.toLocaleString()}`} sub="Cumulative Payout" />
                <StatCard icon={<Users className="text-emerald-400" />} label="Workforce" value={String(employeeCount)} sub={`${activeCount} Nodes Active`} />
                <StatCard icon={<TrendingUp className="text-purple-400" />} label="Avg. Payload" value={`$${avgSalary.toLocaleString()}`} sub="Per Employee Node" />
                <StatCard icon={<FileText className="text-amber-400" />} label="Ledger Entries" value={String(transactionCount)} sub="Total Verified Tx" />
              </div>

              {/* DATA VISUALIZATION SECTION */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Payroll History Chart */}
                <div className="p-8 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-slate-500" /> Payroll History
                    </h2>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Last 6 Cycles</span>
                  </div>
                  
                  <div className="h-64 flex items-end justify-between gap-3 px-2">
                    {payrollHistory.length > 0 ? (
                      payrollHistory.slice(-6).map((item: any, i: number) => {
                        const maxAmount = Math.max(...payrollHistory.map((h: any) => h.amount_usd || 0));
                        const heightPercent = maxAmount > 0 ? ((item.amount_usd || 0) / maxAmount) * 100 : 0;
                        return (
                          <div key={i} className="flex-1 group relative">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-600/40 to-cyan-500/60 rounded-t-xl group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-500 cursor-help border-t border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                              style={{ height: `${Math.max(heightPercent, 8)}%` }}
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-600 uppercase">{item.month?.slice(0, 3)}</span>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                ${item.amount_usd?.toLocaleString()}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                        Awaiting Distribution Data
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="p-8 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl relative">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4 text-slate-500" /> Member Distribution
                    </h2>
                  </div>
                  <div className="space-y-8">
                    <ProgressBar label="Active Nodes" count={activeCount} total={employeeCount} color="from-emerald-500 to-green-600" />
                    <ProgressBar label="Inactive Nodes" count={employeeCount - activeCount} total={employeeCount} color="from-slate-600 to-slate-400" />
                    
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                        <MiniData label="Verified" val={String(activeCount)} color="text-emerald-400" />
                        <MiniData label="Pending" val={String(employeeCount - activeCount)} color="text-slate-400" />
                        <MiniData label="Network" val="Base L2" color="text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* TRANSACTION HISTORY TABLE */}
              <div className="bg-white/[0.02] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Transaction Registry</h2>
                  <button className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300">View All Records</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <th className="px-8 py-5 text-left">Timestamp</th>
                        <th className="px-6 py-5 text-left">Event Type</th>
                        <th className="px-6 py-5 text-left">Payload Volume</th>
                        <th className="px-6 py-5 text-left">Status</th>
                        <th className="px-8 py-5 text-right pr-12">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.length > 0 ? (
                        transactions.slice(0, 5).map((tx, i) => (
                          <tr key={tx.id || i} className="hover:bg-white/[0.04] transition-all group cursor-pointer">
                            <td className="px-8 py-5">
                              <div className="text-xs font-bold text-white">{new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                              <div className="text-[10px] font-bold text-slate-600 font-mono tracking-tighter uppercase">{tx.tx_hash?.slice(0, 14)}...</div>
                            </td>
                            <td className="px-6 py-5 capitalize text-xs font-bold text-slate-300">
                              {tx.tx_type?.replace(/_/g, ' ')}
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-xs font-bold text-white">
                                ${((Number(tx.amount_wei) / 1e18) / 16000).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                                tx.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                <div className={`w-1 h-1 rounded-full ${tx.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right pr-12">
                               <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all ml-auto" />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="py-20 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600">No Cryptographic Logs Found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// RESTYLED SUB-COMPONENTS
function StatCard({ icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) {
  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-[30px] rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      </div>
      <div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{sub}</div>
      </div>
    </div>
  );
}

function ProgressBar({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-bold text-slate-500">{count} MEMBERS</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function MiniData({ label, val, color }: { label: string, val: string, color: string }) {
    return (
        <div>
            <div className="text-[9px] font-bold text-slate-600 mb-1 uppercase tracking-widest">{label}</div>
            <div className={`text-sm font-bold ${color} tracking-tight`}>{val}</div>
        </div>
    );
}