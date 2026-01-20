import { Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const transactions = [
    { date: 'Jan 25', type: 'receive', title: 'Salary Payment', amount: '+ $430.00', time: '14:32 UTC', hash: '0xabc...', status: 'success' },
    { date: 'Jan 20', type: 'send', title: 'Bank Withdrawal', amount: '- $215.00', time: '09:15 UTC', hash: '0xdef...', status: 'success' },
    { date: 'Jan 15', type: 'receive', title: 'Bonus Payment', amount: '+ $100.00', time: '16:20 UTC', hash: '0xghi...', status: 'success' },
    { date: 'Jan 10', type: 'send', title: 'Bank Withdrawal', amount: '- $150.00', time: '10:45 UTC', hash: '0xjkl...', status: 'success' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Payve</div>
                <div className="text-xs text-cyan-400">Employee Portal</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-all">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">2</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
              AS
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Balance Section */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-cyan-500/30 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <p className="text-xs uppercase text-slate-300 tracking-wide font-semibold">Available Balance</p>
          </div>
          <p className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">$430.00</p>
          <p className="text-sm text-slate-400 mb-8">~6,880,000 IDRX</p>
          
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => onNavigate('withdraw-modal')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 h-12 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Withdraw to Bank
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-semibold">Current Salary</p>
            <p className="text-3xl font-bold text-white mb-1">$430</p>
            <p className="text-xs text-slate-500">per month</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-semibold">Next Payroll</p>
            <p className="text-3xl font-bold text-white mb-1">Feb 25</p>
            <p className="text-xs text-slate-500">18 days remaining</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-semibold">Contract Status</p>
            <p className="text-3xl font-bold text-emerald-400 mb-1">Active</p>
            <p className="text-xs text-slate-500">until Dec 31, 2026</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">View All</button>
          </div>
          
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-700/30 transition-all border border-transparent hover:border-white/10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  tx.type === 'receive' 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  {tx.type === 'receive' ? (
                    <ArrowDownLeft className="w-6 h-6 text-white" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-white">{tx.title}</p>
                    <p className={`font-bold ${
                      tx.type === 'receive' ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>{tx.amount}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-slate-400">{tx.date} • {tx.time}</p>
                    <p className="text-slate-500 font-mono">{tx.hash}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No transactions yet</p>
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <Zap className="w-4 h-4" />
            <span>Powered by Base L2 • All transactions are instant and secure</span>
          </div>
        </div>
      </main>
    </div>
  );
}