import { Search, Download, ExternalLink, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, Calendar, Zap, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { EmployeeSidebar } from '@/app/components/EmployeeSidebar';
import { EmployeeHeader } from '@/app/components/EmployeeHeader';
import { useState, useEffect } from 'react';

interface PayrollHistoryProps {
  onNavigate: (page: string) => void;
}

export function PayrollHistory({ onNavigate }: PayrollHistoryProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const transactions = [
    { date: 'Jan 25, 2026', type: 'receive', title: 'Salary Payment', amount: '+ $430.00', time: '14:32 UTC', hash: '0xabc123def456', status: 'success', idrx: '6,880,000 IDRX', category: 'Salary' },
    { date: 'Jan 20, 2026', type: 'send', title: 'Bank Withdrawal', amount: '- $215.00', time: '09:15 UTC', hash: '0xdef789ghi012', status: 'success', idrx: '3,440,000 IDRX', category: 'Withdrawal' },
    { date: 'Jan 15, 2026', type: 'receive', title: 'Bonus Payment', amount: '+ $100.00', time: '16:20 UTC', hash: '0xghi345jkl678', status: 'success', idrx: '1,600,000 IDRX', category: 'Bonus' },
    { date: 'Jan 10, 2026', type: 'send', title: 'Bank Withdrawal', amount: '- $150.00', time: '10:45 UTC', hash: '0xjkl901mno234', status: 'success', idrx: '2,400,000 IDRX', category: 'Withdrawal' },
    { date: 'Dec 25, 2025', type: 'receive', title: 'Salary Payment', amount: '+ $430.00', time: '14:30 UTC', hash: '0xaaa111bbb222', status: 'success', idrx: '6,880,000 IDRX', category: 'Salary' },
    { date: 'Dec 20, 2025', type: 'send', title: 'Bank Withdrawal', amount: '- $300.00', time: '10:20 UTC', hash: '0xccc333ddd444', status: 'success', idrx: '4,800,000 IDRX', category: 'Withdrawal' },
    { date: 'Dec 15, 2025', type: 'receive', title: 'Year-end Bonus', amount: '+ $500.00', time: '15:45 UTC', hash: '0xeee555fff666', status: 'success', idrx: '8,000,000 IDRX', category: 'Bonus' },
    { date: 'Nov 25, 2025', type: 'receive', title: 'Salary Payment', amount: '+ $430.00', time: '14:35 UTC', hash: '0xggg777hhh888', status: 'success', idrx: '6,880,000 IDRX', category: 'Salary' },
    { date: 'Nov 18, 2025', type: 'send', title: 'Bank Withdrawal', amount: '- $200.00', time: '09:30 UTC', hash: '0xjjj999kkk000', status: 'success', idrx: '3,200,000 IDRX', category: 'Withdrawal' },
    { date: 'Nov 10, 2025', type: 'receive', title: 'Performance Bonus', amount: '+ $150.00', time: '16:00 UTC', hash: '0xlll111mmm222', status: 'success', idrx: '2,400,000 IDRX', category: 'Bonus' },
  ];

  const filteredTransactions = selectedFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.category.toLowerCase() === selectedFilter);

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      {/* Sidebar */}
      <EmployeeSidebar currentPage="payroll-history" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <EmployeeHeader 
          title="Payroll History"
          subtitle="View all your payment transactions"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
        >
          <Button 
            variant="outline"
            className="h-10 px-4 border-white/10 text-white hover:bg-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </EmployeeHeader>

        {/* Content Area */}
        <div className="p-4 sm:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Received */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Total Received</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">$2,040.00</p>
              <p className="text-xs text-slate-400">32,640,000 IDRX</p>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Total Withdrawn</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">$865.00</p>
              <p className="text-xs text-slate-400">13,840,000 IDRX</p>
            </div>

            {/* Transactions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Transactions</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{transactions.length}</p>
              <p className="text-xs text-slate-400">All time</p>
            </div>

            {/* Current Balance */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-white/90 font-medium">Current Balance</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">$430.00</p>
              <p className="text-xs text-white/80">6,880,000 IDRX</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search transactions..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-800/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-white placeholder:text-slate-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 h-12 rounded-xl font-semibold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('salary')}
                className={`px-4 h-12 rounded-xl font-semibold transition-all ${
                  selectedFilter === 'salary'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Salary
              </button>
              <button
                onClick={() => setSelectedFilter('bonus')}
                className={`px-4 h-12 rounded-xl font-semibold transition-all ${
                  selectedFilter === 'bonus'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Bonus
              </button>
              <button
                onClick={() => setSelectedFilter('withdrawal')}
                className={`px-4 h-12 rounded-xl font-semibold transition-all ${
                  selectedFilter === 'withdrawal'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Withdrawals
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 p-6 border-b border-white/10 bg-slate-900/50">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide col-span-2">Description</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Amount (USD)</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Amount (IDRX)</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/5">
              {filteredTransactions.map((tx, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 p-4 md:p-6 hover:bg-slate-700/30 transition-all group"
                >
                  {/* Date - Mobile & Desktop */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'receive' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{tx.date}</p>
                      <p className="text-xs text-slate-400">{tx.time}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-sm font-semibold text-white mb-1">{tx.title}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                        tx.category === 'Salary' ? 'bg-blue-500/20 text-blue-400' :
                        tx.category === 'Bonus' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {tx.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{tx.hash.slice(0, 10)}...</span>
                    </div>
                  </div>

                  {/* Amount USD */}
                  <div className="flex items-center md:block">
                    <span className="md:hidden text-xs text-slate-400 mr-2">USD:</span>
                    <p className={`text-sm font-bold ${
                      tx.type === 'receive' ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      {tx.amount}
                    </p>
                  </div>

                  {/* Amount IDRX */}
                  <div className="flex items-center md:block">
                    <span className="md:hidden text-xs text-slate-400 mr-2">IDRX:</span>
                    <p className="text-sm text-slate-300 font-medium">{tx.idrx}</p>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-white/10 hover:bg-slate-700 transition-all text-xs text-white font-semibold flex items-center gap-1.5">
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">Receipt</span>
                    </button>
                    <a 
                      href={`https://basescan.org/tx/${tx.hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-slate-700/50 border border-white/10 hover:bg-slate-700 transition-all flex items-center justify-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex gap-2">
              <button className="px-4 h-10 rounded-xl bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 transition-all text-sm text-white font-semibold">
                Previous
              </button>
              <button className="px-4 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg">
                1
              </button>
              <button className="px-4 h-10 rounded-xl bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 transition-all text-sm text-white font-semibold">
                2
              </button>
              <button className="px-4 h-10 rounded-xl bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 transition-all text-sm text-white font-semibold">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
