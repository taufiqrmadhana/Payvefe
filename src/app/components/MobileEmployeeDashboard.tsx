import { Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Menu, Zap, DollarSign } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface MobileEmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function MobileEmployeeDashboard({ onNavigate }: MobileEmployeeDashboardProps) {
  const transactions = [
    { date: 'Jan 25', type: 'receive', title: 'Salary Payment', amount: '+ $430', status: 'success' },
    { date: 'Jan 20', type: 'send', title: 'Bank Withdrawal', amount: '- $215', status: 'success' },
    { date: 'Jan 15', type: 'receive', title: 'Bonus Payment', amount: '+ $100', status: 'success' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold">Payve</div>
            <div className="text-xs text-cyan-400">Employee</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">2</span>
          </button>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-cyan-500/30 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <p className="text-xs uppercase text-slate-300 tracking-wide font-semibold">Balance</p>
          </div>
          <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">$430.00</p>
          <p className="text-sm text-slate-400 mb-6">~6,880,000 IDRX</p>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('withdraw-modal')}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg text-sm"
            >
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              Withdraw
            </Button>
            <Button 
              variant="outline"
              className="w-full text-white border-white/20 hover:bg-white/10 h-11 rounded-xl text-sm"
            >
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Send
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
            <p className="text-2xl font-bold text-white">$430</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase">Next Pay</p>
            <p className="text-2xl font-bold text-white">18 days</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Activity</h3>
            <button className="text-xs text-cyan-400 font-semibold">View All</button>
          </div>

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
        </div>

        {/* Contract Info */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <p className="text-xs uppercase text-slate-300 tracking-wide font-semibold">Contract Status</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mb-1">Active</p>
          <p className="text-sm text-slate-400">Valid until Dec 31, 2026</p>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <Zap className="w-4 h-4" />
            <span>Powered by Base L2 • Instant & Secure</span>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1 py-2 text-cyan-400">
            <Wallet className="w-5 h-5" />
            <span className="text-xs font-semibold">Wallet</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-slate-400 hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-xs">History</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-slate-400 hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Payroll</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-slate-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
