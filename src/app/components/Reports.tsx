import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, Users, FileText, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Zap, Loader2 } from 'lucide-react';
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
  
  // Fetch real data from API
  const { stats, analytics, loading: dashboardLoading } = useDashboard(address);
  const { transactions, total: txTotal, loading: txLoading } = useTransactions(address, true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isLoading = dashboardLoading || txLoading;

  // Calculate summary stats from real data
  const totalPaid = stats?.financials?.total_paid_usd ?? 0;
  const employeeCount = stats?.employees?.total ?? 0;
  const activeCount = stats?.employees?.active ?? 0;
  const avgSalary = employeeCount > 0 ? (stats?.financials?.total_monthly_payroll_usd ?? 0) / employeeCount : 0;
  const transactionCount = txTotal ?? 0;

  // Get payroll history for chart
  const payrollHistory = analytics?.payroll_history ?? [];

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      <Sidebar currentPage="reports" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto">
        <CompanyHeader 
          title="Reports & Analytics"
          subtitle="Track payroll metrics and insights"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
          showNotifications={true}
        >
          <Button className="h-10 sm:h-11 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold text-sm sm:text-base">
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export All</span>
          </Button>
        </CompanyHeader>

        {/* Content Area */}
        <div className="p-4 sm:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-white">${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-slate-500 mt-2">All time</p>
                </div>

                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      {activeCount} active
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-white">{employeeCount}</p>
                  <p className="text-xs text-slate-500 mt-2">In company</p>
                </div>

                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">Average Salary</p>
                  <p className="text-3xl font-bold text-white">${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-slate-500 mt-2">Per employee</p>
                </div>

                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">Transactions</p>
                  <p className="text-3xl font-bold text-white">{transactionCount}</p>
                  <p className="text-xs text-slate-500 mt-2">Total recorded</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Payroll Trend */}
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-white">Payroll History</h2>
                    <BarChart3 className="w-5 h-5 text-slate-400" />
                  </div>
                  {payrollHistory.length > 0 ? (
                    <div className="h-64 flex items-end justify-between gap-2">
                      {payrollHistory.slice(-6).map((item: any, i: number) => {
                        const maxAmount = Math.max(...payrollHistory.map((h: any) => h.amount_usd || 0));
                        const heightPercent = maxAmount > 0 ? ((item.amount_usd || 0) / maxAmount) * 100 : 0;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer min-h-[4px]"
                              style={{ height: `${Math.max(heightPercent, 5)}%` }}
                              title={`$${(item.amount_usd || 0).toLocaleString()}`}
                            ></div>
                            <span className="text-xs text-slate-500">{item.month?.slice(0, 3) || ''}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400">
                      No payroll history yet
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-slate-400">Monthly Payroll</div>
                    <div className="text-2xl font-bold text-white">
                      ${(stats?.financials?.total_monthly_payroll_usd ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                {/* Employee Stats */}
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-white">Employee Overview</h2>
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Active Employees</span>
                        <span className="text-sm text-slate-400">{activeCount} employees</span>
                      </div>
                      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all"
                          style={{ width: `${employeeCount > 0 ? (activeCount / employeeCount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Inactive Employees</span>
                        <span className="text-sm text-slate-400">{employeeCount - activeCount} employees</span>
                      </div>
                      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-slate-500 to-slate-400 rounded-full transition-all"
                          style={{ width: `${employeeCount > 0 ? ((employeeCount - activeCount) / employeeCount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Total</div>
                      <div className="text-xl font-bold text-white">{employeeCount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Active</div>
                      <div className="text-xl font-bold text-emerald-400">{activeCount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Inactive</div>
                      <div className="text-xl font-bold text-slate-400">{employeeCount - activeCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="font-bold text-white">Recent Transactions</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.length > 0 ? (
                        transactions.slice(0, 5).map((tx, i) => (
                          <tr key={tx.id || i} className="hover:bg-slate-700/30 transition-all">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-white">
                                {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="text-xs text-slate-500 font-mono">{tx.tx_hash?.slice(0, 10)}...</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-white capitalize">{tx.tx_type?.replace(/_/g, ' ') || 'Transaction'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold text-white">
                                ${((Number(tx.amount_wei) / 1e18) / 16000).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                tx.status === 'confirmed' 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : tx.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  tx.status === 'confirmed' ? 'bg-emerald-400' : tx.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
                                }`}></div>
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button 
                                variant="ghost" 
                                className="text-cyan-400 hover:text-cyan-300 text-sm"
                                onClick={() => window.open(`https://basescan.org/tx/${tx.tx_hash}`, '_blank')}
                              >
                                View on Explorer
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            No transactions yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-slate-900/50">
                  <div className="text-sm text-slate-400">
                    Showing {Math.min(transactions.length, 5)} of {txTotal} transactions
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
