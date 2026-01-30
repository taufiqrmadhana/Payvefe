import { Search, Download, ExternalLink, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, Calendar, Zap, Filter, ChevronDown, Loader2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { EmployeeSidebar } from '@/app/components/EmployeeSidebar';
import { EmployeeHeader } from '@/app/components/EmployeeHeader';
import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useTransactions } from '@/hooks/useApi';
import { payslipService } from '@/services/payslipService';
import type { Transaction } from '@/services/transactionService';

interface PayrollHistoryProps {
  onNavigate: (page: string) => void;
}

// Format amount from wei
const formatAmount = (wei: number): string => {
  const idrx = wei / 1e18;
  const usd = idrx / 16000; // Simple conversion
  return usd.toFixed(2);
};

const formatIDRX = (wei: number): string => {
  const idrx = wei / 1e18;
  return idrx.toLocaleString('id-ID');
};

const formatDate = (dateStr: string): { date: string; time: string } => {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }),
  };
};

const getTransactionType = (txType: string): 'receive' | 'send' => {
  return ['distribute', 'deposit', 'claim_invite', 'mint'].includes(txType) ? 'receive' : 'send';
};

const getTransactionTitle = (txType: string): string => {
  switch (txType) {
    case 'distribute': return 'Salary Payment';
    case 'deposit': return 'Deposit Received';
    case 'withdraw': return 'Bank Withdrawal';
    case 'create_invite': return 'Invite Created';
    case 'claim_invite': return 'Claimed Invite';
    case 'mint': return 'Token Mint';
    default: return 'Transaction';
  }
};

const getCategory = (txType: string): string => {
  switch (txType) {
    case 'distribute': return 'Salary';
    case 'deposit': return 'Deposit';
    case 'withdraw': return 'Withdrawal';
    default: return 'Other';
  }
};

export function PayrollHistory({ onNavigate }: PayrollHistoryProps) {
  const { address } = useAccount();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { transactions, total, page, loading, error, refresh, nextPage, prevPage } = useTransactions(address, false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    let received = 0;
    let withdrawn = 0;

    transactions.forEach((tx) => {
      const amount = tx.amount_wei / 1e18 / 16000; // Convert wei to USD
      if (getTransactionType(tx.tx_type) === 'receive') {
        received += amount;
      } else {
        withdrawn += amount;
      }
    });

    return {
      totalReceived: received,
      totalWithdrawn: withdrawn,
      count: transactions.length,
      balance: received - withdrawn,
    };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((t) => getCategory(t.tx_type).toLowerCase() === selectedFilter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.tx_hash.toLowerCase().includes(query) ||
          getTransactionTitle(t.tx_type).toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, selectedFilter, searchQuery]);

  const handleDownloadPayslip = () => {
    // Open payslip preview in new tab
    if (address) {
      const url = payslipService.getPreviewUrl(500, 'My Company', 'Employee', 'TK/0', true, 16000);
      window.open(url, '_blank');
    }
  };

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
          <div className="flex gap-2">
            <Button
              onClick={() => refresh()}
              variant="outline"
              size="icon"
              className="h-10 w-10 border-white/10 text-white hover:bg-white/10 rounded-xl bg-slate-800/50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={handleDownloadPayslip}
              variant="outline"
              className="h-10 px-4 border-white/10 text-white hover:bg-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm"
            >
              <FileText className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">View Payslip</span>
            </Button>
          </div>
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
              <p className="text-2xl font-bold text-white mb-1">${stats.totalReceived.toFixed(2)}</p>
              <p className="text-xs text-slate-400">{(stats.totalReceived * 16000).toLocaleString('id-ID')} IDRX</p>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Total Withdrawn</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">${stats.totalWithdrawn.toFixed(2)}</p>
              <p className="text-xs text-slate-400">{(stats.totalWithdrawn * 16000).toLocaleString('id-ID')} IDRX</p>
            </div>

            {/* Transactions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Transactions</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{total}</p>
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
              <p className="text-2xl font-bold text-white mb-1">${stats.balance.toFixed(2)}</p>
              <p className="text-xs text-white/80">{(stats.balance * 16000).toLocaleString('id-ID')} IDRX</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-800/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-white placeholder:text-slate-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'salary', 'deposit', 'withdrawal'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 h-12 rounded-xl font-semibold transition-all capitalize ${selectedFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10'
                    }`}
                >
                  {filter === 'all' ? 'All' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && transactions.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-white font-medium">Failed to load transactions</p>
              <p className="text-slate-400 text-sm mt-1">{error.message}</p>
              <Button onClick={() => refresh()} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTransactions.length === 0 && (
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-12 text-center">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-white font-medium">No transactions found</p>
              <p className="text-slate-400 text-sm mt-1">Your transactions will appear here</p>
            </div>
          )}

          {/* Transactions Table */}
          {!loading && !error && filteredTransactions.length > 0 && (
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
                {filteredTransactions.map((tx) => {
                  const txType = getTransactionType(tx.tx_type);
                  const { date, time } = formatDate(tx.created_at);
                  const amountUsd = tx.amount_wei / 1e18 / 16000;
                  const amountIdrx = tx.amount_wei / 1e18;

                  return (
                    <div
                      key={tx.id}
                      className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 p-4 md:p-6 hover:bg-slate-700/30 transition-all group"
                    >
                      {/* Date */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txType === 'receive'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-orange-500/20 text-orange-400'
                          }`}>
                          {txType === 'receive' ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{date}</p>
                          <p className="text-xs text-slate-400">{time}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-sm font-semibold text-white mb-1">{getTransactionTitle(tx.tx_type)}</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${getCategory(tx.tx_type) === 'Salary' ? 'bg-blue-500/20 text-blue-400' :
                              getCategory(tx.tx_type) === 'Deposit' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-orange-500/20 text-orange-400'
                            }`}>
                            {getCategory(tx.tx_type)}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{tx.tx_hash.slice(0, 10)}...</span>
                        </div>
                      </div>

                      {/* Amount USD */}
                      <div className="flex items-center md:block">
                        <span className="md:hidden text-xs text-slate-400 mr-2">USD:</span>
                        <p className={`text-sm font-bold ${txType === 'receive' ? 'text-emerald-400' : 'text-orange-400'
                          }`}>
                          {txType === 'receive' ? '+' : '-'} ${amountUsd.toFixed(2)}
                        </p>
                      </div>

                      {/* Amount IDRX */}
                      <div className="flex items-center md:block">
                        <span className="md:hidden text-xs text-slate-400 mr-2">IDRX:</span>
                        <p className="text-sm text-slate-300 font-medium">{amountIdrx.toLocaleString('id-ID')} IDRX</p>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://basescan.org/tx/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-slate-700/50 border border-white/10 hover:bg-slate-700 transition-all flex items-center justify-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && total > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing {filteredTransactions.length} of {total} transactions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  disabled={page <= 1}
                  className="px-4 h-10 rounded-xl bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 transition-all text-sm text-white font-semibold disabled:opacity-50"
                >
                  Previous
                </button>
                <button className="px-4 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg">
                  {page}
                </button>
                <button
                  onClick={nextPage}
                  disabled={page * 20 >= total}
                  className="px-4 h-10 rounded-xl bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 transition-all text-sm text-white font-semibold disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
