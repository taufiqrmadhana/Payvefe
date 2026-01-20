import { Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Zap, TrendingUp, DollarSign, ExternalLink, Copy, Download, CheckCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const transactions = [
    { date: 'Jan 25', type: 'receive', title: 'Salary Payment', amount: '+ $430.00', time: '14:32 UTC', hash: '0xabc123def456', status: 'success', idrx: '6,880,000 IDRX' },
    { date: 'Jan 20', type: 'send', title: 'Bank Withdrawal', amount: '- $215.00', time: '09:15 UTC', hash: '0xdef789ghi012', status: 'success', idrx: '3,440,000 IDRX' },
    { date: 'Jan 15', type: 'receive', title: 'Bonus Payment', amount: '+ $100.00', time: '16:20 UTC', hash: '0xghi345jkl678', status: 'success', idrx: '1,600,000 IDRX' },
    { date: 'Jan 10', type: 'send', title: 'Bank Withdrawal', amount: '- $150.00', time: '10:45 UTC', hash: '0xjkl901mno234', status: 'success', idrx: '2,400,000 IDRX' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Payve</div>
                  <div className="text-xs text-cyan-400 font-medium">Employee Portal</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative w-11 h-11 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">2</span>
              </button>
              
              {/* Avatar */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/10">
                AS
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-3xl p-8 mb-8 shadow-2xl border border-white/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-5 h-5 text-white/90" />
              <p className="text-sm uppercase text-white/90 tracking-wide font-semibold">Available Balance</p>
            </div>
            
            <div className="mb-8">
              <p className="text-6xl font-bold text-white mb-2">$430.00</p>
              <div className="flex items-center gap-2">
                <p className="text-lg text-white/80 font-medium">6,880,000 IDRX</p>
                <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs text-white font-semibold">
                  ≈ 1 USD = 16,000 IDRX
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => onNavigate('withdraw-modal')}
                className="bg-white text-blue-600 hover:bg-white/90 px-8 h-12 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowDownLeft className="w-5 h-5 mr-2" />
                Withdraw to Bank
              </Button>
              
              <Button 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-6 h-12 rounded-xl font-semibold backdrop-blur-sm"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Payslip
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-4xl font-bold text-white mb-1">$430</p>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transaction History - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
                </div>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  View All →
                </button>
              </div>
              
              <div className="space-y-2">
                {transactions.map((tx, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-slate-700/50 transition-all border border-transparent hover:border-white/10"
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                      tx.type === 'receive' 
                        ? 'bg-gradient-to-br from-emerald-500 to-green-500 group-hover:shadow-emerald-500/50' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:shadow-blue-500/50'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="w-7 h-7 text-white" />
                      ) : (
                        <ArrowUpRight className="w-7 h-7 text-white" />
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-white text-lg">{tx.title}</p>
                        <p className={`text-xl font-bold ${
                          tx.type === 'receive' ? 'text-emerald-400' : 'text-cyan-400'
                        }`}>{tx.amount}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <p className="text-slate-400">{tx.date} • {tx.time}</p>
                          <span className="text-slate-600">•</span>
                          <p className="text-slate-500">{tx.idrx}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-all">
                            <Copy className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-all">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-xs text-slate-600 font-mono">{tx.hash}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
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
                <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Download Payslip</p>
                    <p className="text-xs text-slate-400">January 2026</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">View Contract</p>
                    <p className="text-xs text-slate-400">Employment details</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group">
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
    </div>
  );
}
