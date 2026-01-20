import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, Users, FileText, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Flag } from '@/app/components/ui/flag';
import { Sidebar } from '@/app/components/Sidebar';
import { useState } from 'react';

interface ReportsProps {
  onNavigate: (page: string) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar currentPage="reports" onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <div>
                <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                <p className="text-sm text-slate-400 mt-1">Track payroll metrics and insights</p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  12%
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Paid</p>
              <p className="text-3xl font-bold text-white">$97,200</p>
              <p className="text-xs text-slate-500 mt-2">vs last month</p>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  +3
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Employees Paid</p>
              <p className="text-3xl font-bold text-white">75</p>
              <p className="text-xs text-slate-500 mt-2">3 new this month</p>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs text-red-400 font-semibold">
                  <ArrowDownRight className="w-3 h-3" />
                  2%
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Average Salary</p>
              <p className="text-3xl font-bold text-white">$1,296</p>
              <p className="text-xs text-slate-500 mt-2">vs last month</p>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  3
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Transactions</p>
              <p className="text-3xl font-bold text-white">18</p>
              <p className="text-xs text-slate-500 mt-2">this month</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Payroll Trend */}
            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-white">Payroll Trend</h2>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 85, 75, 95, 90, 100, 87, 92, 88, 97, 93, 100].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-slate-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-sm text-slate-400">Total for 2026</div>
                <div className="text-2xl font-bold text-white">$1.2M</div>
              </div>
            </div>

            {/* Employee Distribution */}
            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-white">Employee Distribution</h2>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {[
                  { country: 'Indonesia', count: 45, percentage: 60, color: 'from-blue-500 to-cyan-500' },
                  { country: 'Singapore', count: 20, percentage: 27, color: 'from-purple-500 to-pink-500' },
                  { country: 'United States', count: 10, percentage: 13, color: 'from-emerald-500 to-green-500' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{item.country}</span>
                      <span className="text-sm text-slate-400">{item.count} employees</span>
                    </div>
                    <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Total</div>
                  <div className="text-xl font-bold text-white">75</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Active</div>
                  <div className="text-xl font-bold text-emerald-400">68</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Expiring</div>
                  <div className="text-xl font-bold text-amber-400">7</div>
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Employees</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { date: 'Jan 25, 2026', type: 'Monthly Payroll', employees: 75, amount: 32400, status: 'Completed', hash: '0x7a9f...' },
                    { date: 'Jan 20, 2026', type: 'Bonus Payment', employees: 10, amount: 5000, status: 'Completed', hash: '0x3d1c...' },
                    { date: 'Jan 15, 2026', type: 'New Employee', employees: 1, amount: 430, status: 'Completed', hash: '0x9e2b...' },
                    { date: 'Dec 25, 2025', type: 'Monthly Payroll', employees: 72, amount: 30960, status: 'Completed', hash: '0x5f8a...' },
                    { date: 'Dec 20, 2025', type: 'Year-end Bonus', employees: 72, amount: 28800, status: 'Completed', hash: '0x1a4c...' }
                  ].map((tx, i) => (
                    <tr key={i} className="hover:bg-slate-700/30 transition-all">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{tx.date}</div>
                        <div className="text-xs text-slate-500 font-mono">{tx.hash}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{tx.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-semibold">{tx.employees}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-white">${tx.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 text-sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-slate-900/50">
              <div className="text-sm text-slate-400">
                Showing 1-5 of 18 transactions
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/30">
                  1
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  2
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  3
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}